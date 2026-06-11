package com.inventory.config;

import com.inventory.entity.*;
import com.inventory.repository.*;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class CsvDataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final StoreBranchRepository storeBranchRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final CustomerRepository customerRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderItemRepository salesOrderItemRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderItemRepository purchaseOrderItemRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            log.info("Data already loaded — skipping CSV import.");
            return;
        }
        log.info("Starting CSV data load...");
        try {
            loadOpenFoodFacts();       // products + categories
            loadRetailInventory();     // store branches + inventory
            loadSupplyChain();         // suppliers + purchase orders
            loadOlistCustomers();      // customers
            loadOlistOrders();         // sales orders + items
            log.info("CSV data load complete.");
        } catch (Exception e) {
            log.error("CSV load failed: {}", e.getMessage(), e);
        }
    }

    // ── 1. Open Food Facts → products + categories ──────────────────────────
    private void loadOpenFoodFacts() throws Exception {
        ClassPathResource res = new ClassPathResource("data/en.openfoodfacts.org.products.csv");
        if (!res.exists()) { log.warn("open food facts CSV not found — skipping"); return; }

        Map<String, Category> catCache = new HashMap<>();
        int loaded = 0;
        int maxRows = 5000;

        try (CSVReader reader = new CSVReader(new InputStreamReader(res.getInputStream()))) {
            String[] header = reader.readNext();
            if (header == null) return;
            Map<String, Integer> idx = index(header);

            String[] row;
            while ((row = reader.readNext()) != null && loaded < maxRows) {
                String code = safe(row, idx, "code");
                String productName = safe(row, idx, "product_name");
                if (productName.isBlank() || code.isBlank()) continue;

                String catName = safe(row, idx, "main_category");
                if (catName.isBlank()) catName = safe(row, idx, "categories");
                if (catName.isBlank()) catName = "Uncategorized";
                catName = catName.split(",")[0].trim();
                if (catName.length() > 100) catName = catName.substring(0, 100);

                Category cat = catCache.computeIfAbsent(catName, n -> categoryRepository
                        .findByName(n)
                        .orElseGet(() -> categoryRepository.save(Category.builder()
                                .name(n).description(n).isActive(true).build())));

                String sku = "OFF-" + (code.length() > 20 ? code.substring(0, 20) : code);
                if (productRepository.findBySku(sku).isPresent()) continue;

                String brand = safe(row, idx, "brands");
                if (brand.length() > 100) brand = brand.substring(0, 100);
                String origin = safe(row, idx, "origins");
                if (origin.isBlank()) origin = "Unknown";
                if (origin.length() > 100) origin = origin.substring(0, 100);

                productRepository.save(Product.builder()
                        .sku(sku)
                        .barcode(code.length() > 100 ? code.substring(0, 100) : code)
                        .name(productName.length() > 255 ? productName.substring(0, 255) : productName)
                        .description(safe(row, idx, "generic_name"))
                        .categoryId(cat.getId())
                        .unitPrice(randomPrice(1.0, 50.0))
                        .costPrice(randomPrice(0.5, 25.0))
                        .brand(brand.isBlank() ? "Unknown" : brand)
                        .originCountry(origin)
                        .status(Product.ProductStatus.ACTIVE)
                        .reorderLevel(20)
                        .reorderQuantity(100)
                        .isPerishable(true)
                        .shelfLifeDays(365)
                        .build());
                loaded++;
            }
        }
        log.info("Loaded {} products from Open Food Facts", loaded);
    }

    // ── 2. Retail Store Inventory → branches + inventory ────────────────────
    private void loadRetailInventory() throws Exception {
        ClassPathResource res = new ClassPathResource("data/retail_store_inventory.csv");
        if (!res.exists()) { log.warn("retail inventory CSV not found — skipping"); return; }

        Map<String, StoreBranch> branchCache = new HashMap<>();
        int loaded = 0;

        try (CSVReader reader = new CSVReader(new InputStreamReader(res.getInputStream()))) {
            String[] header = reader.readNext();
            if (header == null) return;
            Map<String, Integer> idx = index(header);

            String[] row;
            while ((row = reader.readNext()) != null) {
                String storeName = safe(row, idx, "Store ID", "Store_ID", "store_id", "Store");
                if (storeName.isBlank()) storeName = "STORE-" + (branchCache.size() + 1);

                StoreBranch branch = branchCache.computeIfAbsent(storeName, n -> {
                    String code = n.replaceAll("[^A-Z0-9]", "").toUpperCase();
                    if (code.length() > 20) code = code.substring(0, 20);
                    if (code.isBlank()) code = "BR" + (branchCache.size() + 1);
                    final String finalCode = code;
                    return storeBranchRepository.findByBranchCode(finalCode)
                            .orElseGet(() -> storeBranchRepository.save(StoreBranch.builder()
                                    .branchCode(finalCode)
                                    .branchName(n)
                                    .addressLine1("100 Retail Ave")
                                    .city("Chicago").state("IL").postalCode("60601").country("USA")
                                    .phone("+1-555-0100").email(finalCode.toLowerCase() + "@demo.example.com")
                                    .managerName("Store Manager").openingHours("08:00-18:00")
                                    .timezone("America/Chicago").isActive(true).isWarehouse(false)
                                    .build()));
                });

                String rawProductName = safe(row, idx, "Product Name", "Product_Name", "product_name", "Product");
                if (rawProductName.isBlank()) continue;
                final String productName = rawProductName.length() > 255 ? rawProductName.substring(0, 255) : rawProductName;

                String rawSkuKey = "RET-" + productName.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
                final String skuKey = rawSkuKey.length() > 50 ? rawSkuKey.substring(0, 50) : rawSkuKey;

                final int reorderLevelVal = parseInt(safe(row, idx, "Reorder Point", "Reorder_Point", "reorder_point"), 10);

                Product product = productRepository.findBySku(skuKey).orElseGet(() -> {
                    Category cat = categoryRepository.findByName("Retail")
                            .orElseGet(() -> categoryRepository.save(Category.builder()
                                    .name("Retail").description("Retail store products").isActive(true).build()));
                    return productRepository.save(Product.builder()
                            .sku(skuKey)
                            .barcode("BC-" + skuKey)
                            .name(productName)
                            .description("Retail inventory product")
                            .categoryId(cat.getId())
                            .unitPrice(randomPrice(5.0, 200.0))
                            .costPrice(randomPrice(2.0, 100.0))
                            .brand("Retail Brand")
                            .originCountry("USA")
                            .status(Product.ProductStatus.ACTIVE)
                            .reorderLevel(reorderLevelVal)
                            .reorderQuantity(50)
                            .isPerishable(false)
                            .build());
                });

                int qty = parseInt(safe(row, idx, "Stock Quantity", "Stock_Quantity", "stock_quantity", "Quantity", "quantity"), 0);
                int reorder = parseInt(safe(row, idx, "Reorder Point", "Reorder_Point", "reorder_point"), 10);

                if (inventoryRepository.findByProductIdAndStoreBranchId(product.getId(), branch.getId()).isEmpty()) {
                    inventoryRepository.save(Inventory.builder()
                            .productId(product.getId())
                            .storeBranchId(branch.getId())
                            .quantity(qty)
                            .reservedQuantity(0)
                            .availableQuantity(qty)
                            .reorderLevel(reorder)
                            .reorderQuantity(reorder * 4)
                            .maxStockLevel(Math.max(300, qty * 2))
                            .lastRestockedAt(LocalDateTime.now().minusDays(7))
                            .lastCountedAt(LocalDateTime.now().minusHours(6))
                            .locationInStore("SHELF-A")
                            .batchNumber("BATCH-" + product.getSku())
                            .build());
                    loaded++;
                }
            }
        }
        log.info("Loaded {} inventory records from Retail dataset", loaded);
    }

    // ── 3. Supply Chain → suppliers + purchase orders ────────────────────────
    private void loadSupplyChain() throws Exception {
        ClassPathResource res = new ClassPathResource("data/supply_chain_data.csv");
        if (!res.exists()) { log.warn("supply chain CSV not found — skipping"); return; }

        // Ensure at least one branch exists
        StoreBranch defaultBranch = storeBranchRepository.findAll().stream().findFirst()
                .orElseGet(() -> storeBranchRepository.save(StoreBranch.builder()
                        .branchCode("MAIN").branchName("Main Hub").addressLine1("100 Supply Ave")
                        .city("Chicago").state("IL").postalCode("60601").country("USA")
                        .phone("+1-555-0100").email("main@demo.example.com")
                        .managerName("Demo Manager").openingHours("08:00-18:00")
                        .timezone("America/Chicago").isActive(true).isWarehouse(true).build()));

        int supplierCount = 0;
        int poCount = 0;

        try (CSVReader reader = new CSVReader(new InputStreamReader(res.getInputStream()))) {
            String[] header = reader.readNext();
            if (header == null) return;
            Map<String, Integer> idx = index(header);

            String[] row;
            while ((row = reader.readNext()) != null) {
                String supplierName = safe(row, idx, "Supplier name", "Supplier_name", "supplier_name", "Supplier");
                if (supplierName.isBlank()) continue;
                if (supplierName.length() > 150) supplierName = supplierName.substring(0, 150);

                final String finalSupplierName = supplierName;
                final String[] capturedRow = row;
                final Map<String, Integer> capturedIdx = idx;

                Supplier supplier = supplierRepository.searchSuppliers(supplierName).stream().findFirst()
                        .orElseGet(() -> {
                            String code = "SUP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                            return supplierRepository.save(Supplier.builder()
                                    .supplierCode(code)
                                    .supplierName(finalSupplierName)
                                    .contactPerson("Contact Person")
                                    .email(finalSupplierName.replaceAll("[^a-zA-Z0-9]", "").toLowerCase() + "@supplier.com")
                                    .phone("+1-555-0000")
                                    .city("New York").state("NY").postalCode("10001").country("USA")
                                    .paymentTerms("Net 30")
                                    .leadTimeDays(parseInt(safe(capturedRow, capturedIdx, "Lead time", "Lead_time", "lead_time", "Lead Time"), 7))
                                    .minimumOrderAmount(500.0)
                                    .currency("USD")
                                    .isActive(true)
                                    .isPreferred(false)
                                    .notes("Loaded from supply chain dataset")
                                    .build());
                        });
                supplierCount++;

                String rawProductType = safe(capturedRow, capturedIdx, "Product type", "Product_type", "product_type", "Product Type");
                if (rawProductType.isBlank()) rawProductType = "Supply Item";
                final String productType = rawProductType.length() > 255 ? rawProductType.substring(0, 255) : rawProductType;

                String rawSku = "SC-" + productType.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
                final String sku = rawSku.length() > 50 ? rawSku.substring(0, 50) : rawSku;

                Product product = productRepository.findBySku(sku).orElseGet(() -> {
                    Category cat = categoryRepository.findByName("Supply Chain")
                            .orElseGet(() -> categoryRepository.save(Category.builder()
                                    .name("Supply Chain").description("Supply chain products").isActive(true).build()));
                    return productRepository.save(Product.builder()
                            .sku(sku).barcode("BC-" + sku)
                            .name(productType).description("Supply chain product")
                            .categoryId(cat.getId())
                            .unitPrice(parseBigDecimal(safe(capturedRow, capturedIdx, "Price", "price"), 20.0))
                            .costPrice(parseBigDecimal(safe(capturedRow, capturedIdx, "Manufacturing costs", "manufacturing_costs"), 10.0))
                            .brand("Supply Brand").originCountry("USA")
                            .status(Product.ProductStatus.ACTIVE)
                            .reorderLevel(10).reorderQuantity(50).isPerishable(false)
                            .build());
                });

                int orderQty = parseInt(safe(row, idx, "Order quantities", "Order_quantities", "order_quantities"), 50);
                BigDecimal lineTotal = product.getCostPrice().multiply(BigDecimal.valueOf(orderQty));

                PurchaseOrderItem poItem = PurchaseOrderItem.builder()
                        .product(product)
                        .orderedQuantity(orderQty)
                        .receivedQuantity(0)
                        .unitPrice(product.getCostPrice())
                        .discountPercent(BigDecimal.ZERO)
                        .taxPercent(new BigDecimal("8.25"))
                        .lineTotal(lineTotal)
                        .expectedDeliveryDate(LocalDateTime.now().plusDays(parseInt(safe(row, idx, "Lead time", "Lead_time", "lead_time"), 7)))
                        .notes("Supply chain dataset import")
                        .build();

                String poNumber = "PO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                PurchaseOrder po = purchaseOrderRepository.save(PurchaseOrder.builder()
                        .poNumber(poNumber)
                        .supplier(supplier)
                        .storeBranch(defaultBranch)
                        .orderDate(LocalDate.now().minusDays(new Random().nextInt(30)))
                        .expectedDeliveryDate(LocalDate.now().plusDays(parseInt(safe(row, idx, "Lead time", "Lead_time", "lead_time"), 7)))
                        .status(randomPoStatus())
                        .totalAmount(lineTotal)
                        .taxAmount(lineTotal.multiply(new BigDecimal("0.0825")))
                        .shippingAmount(new BigDecimal("50.00"))
                        .discountAmount(BigDecimal.ZERO)
                        .currency("USD").exchangeRate(BigDecimal.ONE)
                        .notes("Imported from supply chain dataset")
                        .termsConditions("Net 30")
                        .createdBy("System Import")
                        .build());

                poItem.setPurchaseOrder(po);
                purchaseOrderItemRepository.save(poItem);
                poCount++;
            }
        }
        log.info("Loaded {} suppliers and {} purchase orders from Supply Chain dataset", supplierCount, poCount);
    }

    // ── 4. Olist Customers ───────────────────────────────────────────────────
    private void loadOlistCustomers() throws Exception {
        ClassPathResource res = new ClassPathResource("data/olist_customers_dataset.csv");
        if (!res.exists()) { log.warn("olist customers CSV not found — skipping"); return; }

        int loaded = 0;
        Set<String> seenEmails = new HashSet<>();

        try (CSVReader reader = new CSVReader(new InputStreamReader(res.getInputStream()))) {
            String[] header = reader.readNext();
            if (header == null) return;
            Map<String, Integer> idx = index(header);

            String[] row;
            while ((row = reader.readNext()) != null) {
                String uid = safe(row, idx, "customer_unique_id", "customer_id");
                if (uid.isBlank()) continue;
                if (uid.length() > 50) uid = uid.substring(0, 50);

                String city = safe(row, idx, "customer_city");
                String state = safe(row, idx, "customer_state");
                String zip = safe(row, idx, "customer_zip_code_prefix");

                // Generate a deterministic email from uid to avoid duplicates
                String email = uid.substring(0, Math.min(20, uid.length())) + "@olist.demo";
                if (seenEmails.contains(email)) continue;
                seenEmails.add(email);

                if (customerRepository.findByEmail(email).isPresent()) continue;

                customerRepository.save(Customer.builder()
                        .customerUniqueId(uid)
                        .firstName("Customer")
                        .lastName(uid.substring(0, Math.min(8, uid.length())))
                        .email(email)
                        .phone("+55-00-0000-0000")
                        .documentType("CPF")
                        .documentNumber(uid.substring(0, Math.min(14, uid.length())))
                        .zipCode(zip.isBlank() ? "00000" : zip)
                        .city(city.isBlank() ? "Unknown" : city)
                        .state(state.isBlank() ? "XX" : state)
                        .country("Brazil")
                        .isActive(true)
                        .build());
                loaded++;
            }
        }
        log.info("Loaded {} customers from Olist dataset", loaded);
    }

    // ── 5. Olist Orders + Items ──────────────────────────────────────────────
    private void loadOlistOrders() throws Exception {
        ClassPathResource ordersRes = new ClassPathResource("data/olist_orders_dataset.csv");
        ClassPathResource itemsRes = new ClassPathResource("data/olist_order_items_dataset.csv");
        if (!ordersRes.exists() || !itemsRes.exists()) {
            log.warn("olist orders or items CSV not found — skipping");
            return;
        }

        // Map customer_id → Customer (olist uses customer_id on orders, customer_unique_id is the dedup key)
        Map<String, Customer> customerById = new HashMap<>();
        try (CSVReader r = new CSVReader(new InputStreamReader(
                new ClassPathResource("data/olist_customers_dataset.csv").getInputStream()))) {
            String[] h = r.readNext();
            if (h != null) {
                Map<String, Integer> ci = index(h);
                String[] row;
                while ((row = r.readNext()) != null) {
                    String cid = safe(row, ci, "customer_id");
                    String uid = safe(row, ci, "customer_unique_id");
                    if (cid.isBlank() || uid.isBlank()) continue;
                    String email = uid.substring(0, Math.min(20, uid.length())) + "@olist.demo";
                    customerRepository.findByEmail(email).ifPresent(c -> customerById.put(cid, c));
                }
            }
        }

        // Map order_id → list of item rows, keeping the items header separately
        Map<String, List<String[]>> itemsByOrder = new HashMap<>();
        Map<String, Integer> itemsIdx = new HashMap<>();
        try (CSVReader r = new CSVReader(new InputStreamReader(itemsRes.getInputStream()))) {
            String[] h = r.readNext();
            if (h != null) {
                itemsIdx.putAll(index(h));
                String[] row;
                while ((row = r.readNext()) != null) {
                    String oid = safe(row, itemsIdx, "order_id");
                    if (!oid.isBlank()) itemsByOrder.computeIfAbsent(oid, k -> new ArrayList<>()).add(row.clone());
                }
            }
        }

        List<Product> allProducts = productRepository.findAll();
        if (allProducts.isEmpty()) { log.warn("No products for order items"); return; }
        StoreBranch branch = storeBranchRepository.findAll().stream().findFirst().orElse(null);
        if (branch == null) { log.warn("No branch for orders"); return; }

        Random rng = new Random(42);
        int loaded = 0;
        int maxOrders = 10000;

        try (CSVReader reader = new CSVReader(new InputStreamReader(ordersRes.getInputStream()))) {
            String[] header = reader.readNext();
            if (header == null) return;
            Map<String, Integer> idx = index(header);
            String[] row;

            while ((row = reader.readNext()) != null && loaded < maxOrders) {
                String orderId = safe(row, idx, "order_id");
                String customerId = safe(row, idx, "customer_id");
                if (orderId.isBlank() || customerId.isBlank()) continue;

                Customer customer = customerById.get(customerId);
                if (customer == null) continue;

                List<String[]> rawItems = itemsByOrder.getOrDefault(orderId, List.of());
                if (rawItems.isEmpty()) continue;

                String orderNumber = "OL-" + orderId.substring(0, Math.min(20, orderId.length()));
                if (salesOrderRepository.findByOrderNumber(orderNumber).isPresent()) continue;

                SalesOrder.OrderStatus status = mapOlistStatus(safe(row, idx, "order_status"));
                LocalDateTime orderDate = parseDateTime(safe(row, idx, "order_purchase_timestamp"));
                LocalDateTime deliveredDate = parseDateTime(safe(row, idx, "order_delivered_customer_date"));

                List<SalesOrderItem> items = new ArrayList<>();
                for (String[] itemRow : rawItems) {
                    Product product = allProducts.get(rng.nextInt(allProducts.size()));
                    BigDecimal price = parseBigDecimal(safe(itemRow, itemsIdx, "price"), 20.0);
                    items.add(SalesOrderItem.builder()
                            .productId(product.getId())
                            .quantity(1)
                            .unitPrice(price)
                            .discountAmount(BigDecimal.ZERO)
                            .totalPrice(price)
                            .build());
                }

                BigDecimal subtotal = items.stream().map(SalesOrderItem::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
                BigDecimal tax = subtotal.multiply(new BigDecimal("0.0825"));
                BigDecimal shipping = new BigDecimal("15.00");

                SalesOrder order = salesOrderRepository.save(SalesOrder.builder()
                        .orderNumber(orderNumber)
                        .customer(customer)
                        .storeBranch(branch)
                        .status(status)
                        .paymentStatus(status == SalesOrder.OrderStatus.DELIVERED ? SalesOrder.PaymentStatus.PAID : SalesOrder.PaymentStatus.PENDING)
                        .orderDate(orderDate != null ? orderDate : LocalDateTime.now().minusDays(loaded))
                        .expectedDeliveryDate(orderDate != null ? orderDate.plusDays(7) : LocalDateTime.now().plusDays(7))
                        .actualDeliveryDate(deliveredDate)
                        .subtotal(subtotal)
                        .taxAmount(tax)
                        .discountAmount(BigDecimal.ZERO)
                        .shippingAmount(shipping)
                        .totalAmount(subtotal.add(tax).add(shipping))
                        .shippingAddress(customer.getCity() + ", " + customer.getState())
                        .billingAddress(customer.getCity() + ", " + customer.getState())
                        .notes("Olist dataset import")
                        .build());

                items.forEach(item -> item.setSalesOrderId(order.getId()));
                salesOrderItemRepository.saveAll(items);
                loaded++;
            }
        }
        log.info("Loaded {} sales orders from Olist dataset", loaded);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Map<String, Integer> index(String[] header) {
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < header.length; i++) map.put(header[i].trim(), i);
        return map;
    }

    /** Try multiple possible column names, return first match or empty string */
    private String safe(String[] row, Map<String, Integer> idx, String... keys) {
        for (String key : keys) {
            Integer i = idx.get(key);
            if (i != null && i < row.length) {
                String v = row[i].trim();
                if (!v.isBlank()) return v;
            }
        }
        return "";
    }

    private int parseInt(String s, int def) {
        try { return Integer.parseInt(s.replaceAll("[^0-9]", "")); } catch (Exception e) { return def; }
    }

    private BigDecimal parseBigDecimal(String s, double def) {
        try { return new BigDecimal(s.replaceAll("[^0-9.]", "")); } catch (Exception e) { return BigDecimal.valueOf(def); }
    }

    private BigDecimal randomPrice(double min, double max) {
        return BigDecimal.valueOf(min + Math.random() * (max - min)).setScale(2, java.math.RoundingMode.HALF_UP);
    }

    private LocalDateTime parseDateTime(String s) {
        if (s == null || s.isBlank()) return null;
        try { return LocalDateTime.parse(s.trim(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")); }
        catch (DateTimeParseException e1) {
            try { return LocalDateTime.parse(s.trim(), DateTimeFormatter.ISO_LOCAL_DATE_TIME); }
            catch (DateTimeParseException e2) { return null; }
        }
    }

    private SalesOrder.OrderStatus mapOlistStatus(String s) {
        return switch (s.toLowerCase()) {
            case "delivered" -> SalesOrder.OrderStatus.DELIVERED;
            case "shipped" -> SalesOrder.OrderStatus.SHIPPED;
            case "processing" -> SalesOrder.OrderStatus.PROCESSING;
            case "approved" -> SalesOrder.OrderStatus.CONFIRMED;
            case "canceled", "cancelled" -> SalesOrder.OrderStatus.CANCELLED;
            default -> SalesOrder.OrderStatus.PENDING;
        };
    }

    private PurchaseOrder.PurchaseOrderStatus randomPoStatus() {
        PurchaseOrder.PurchaseOrderStatus[] statuses = {
            PurchaseOrder.PurchaseOrderStatus.ORDERED,
            PurchaseOrder.PurchaseOrderStatus.SUBMITTED,
            PurchaseOrder.PurchaseOrderStatus.RECEIVED,
            PurchaseOrder.PurchaseOrderStatus.APPROVED
        };
        return statuses[new Random().nextInt(statuses.length)];
    }
}
