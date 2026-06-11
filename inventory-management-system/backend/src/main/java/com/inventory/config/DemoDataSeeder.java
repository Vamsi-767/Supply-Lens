package com.inventory.config;

import com.inventory.entity.Category;
import com.inventory.entity.Customer;
import com.inventory.entity.Inventory;
import com.inventory.entity.Product;
import com.inventory.entity.PurchaseOrder;
import com.inventory.entity.PurchaseOrderItem;
import com.inventory.entity.SalesOrder;
import com.inventory.entity.SalesOrderItem;
import com.inventory.entity.StoreBranch;
import com.inventory.entity.Supplier;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.CustomerRepository;
import com.inventory.repository.InventoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.PurchaseOrderItemRepository;
import com.inventory.repository.PurchaseOrderRepository;
import com.inventory.repository.SalesOrderItemRepository;
import com.inventory.repository.SalesOrderRepository;
import com.inventory.repository.StoreBranchRepository;
import com.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DemoDataSeeder implements CommandLineRunner {

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
    @Transactional
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        Category electronics = categoryRepository.save(Category.builder()
                .name("Electronics")
                .description("Devices, computing, displays, and store technology")
                .isActive(true)
                .build());
        Category accessories = categoryRepository.save(Category.builder()
                .name("Accessories")
                .description("Peripheral items, cabling, and replenishment accessories")
                .isActive(true)
                .build());
        Category food = categoryRepository.save(Category.builder()
                .name("Packaged Food")
                .description("Demo food catalog inspired by public product datasets")
                .isActive(true)
                .build());

        StoreBranch main = storeBranchRepository.save(branch("MAIN", "Main Fulfillment Hub", "Chicago", "IL", true));
        StoreBranch north = storeBranchRepository.save(branch("NORTH", "North Retail Node", "Milwaukee", "WI", false));
        StoreBranch south = storeBranchRepository.save(branch("SOUTH", "South Retail Node", "St. Louis", "MO", false));

        Product laptop = productRepository.save(product("LAP-001", "Laptop Pro", electronics, "Northwind", "USA", "1299.00", "45", 10));
        Product mouse = productRepository.save(product("MOU-002", "Wireless Mouse", electronics, "Northwind", "USA", "29.99", "150", 20));
        Product cable = productRepository.save(product("CAB-003", "USB-C Cable", accessories, "PrimeLine", "China", "9.99", "500", 50));
        Product monitor = productRepository.save(product("MON-004", "Monitor 27\"", electronics, "Apex", "Mexico", "349.00", "32", 8));
        Product keyboard = productRepository.save(product("KEY-005", "Keyboard RGB", accessories, "Apex", "China", "89.99", "78", 25));
        Product oats = productRepository.save(product("FOOD-101", "Organic Oats", food, "Open Pantry", "Brazil", "6.49", "220", 40));

        inventoryRepository.saveAll(List.of(
                inventory(laptop, main, 45, 10, "A-01"),
                inventory(mouse, main, 5, 20, "A-03"),
                inventory(cable, north, 500, 50, "B-12"),
                inventory(monitor, south, 8, 5, "C-07"),
                inventory(keyboard, main, 15, 25, "A-04"),
                inventory(oats, north, 220, 40, "F-02")
        ));

        Supplier techWorld = supplierRepository.save(supplier("SUP-001", "Tech World", "contact@techworld.com", "+1-555-0101", "Ava Morgan", 7, true));
        Supplier global = supplierRepository.save(supplier("SUP-002", "Global Supplies", "info@globalsupplies.com", "+1-555-0102", "Liam Carter", 12, false));
        Supplier prime = supplierRepository.save(supplier("SUP-003", "Prime Distribution", "sales@primedist.com", "+1-555-0103", "Mia Shah", 5, true));
        supplierRepository.save(supplier("SUP-004", "Quality Imports", "orders@qualityimports.com", "+1-555-0104", "Noah Smith", 15, false));

        Customer john = customerRepository.save(customer("CUST-001", "John", "Doe", "john.doe@example.com", "Chicago", "IL"));
        Customer jane = customerRepository.save(customer("CUST-002", "Jane", "Smith", "jane.smith@example.com", "Milwaukee", "WI"));
        Customer mike = customerRepository.save(customer("CUST-003", "Mike", "Johnson", "mike.johnson@example.com", "St. Louis", "MO"));
        Customer sarah = customerRepository.save(customer("CUST-004", "Sarah", "Williams", "sarah.williams@example.com", "Chicago", "IL"));

        createSalesOrder("ORD-001", john, main, SalesOrder.OrderStatus.DELIVERED, LocalDateTime.now().minusDays(1), List.of(
                item(laptop, 1), item(cable, 3)
        ));
        createSalesOrder("ORD-002", jane, north, SalesOrder.OrderStatus.PENDING, LocalDateTime.now().minusDays(2), List.of(
                item(monitor, 2), item(mouse, 4)
        ));
        createSalesOrder("ORD-003", mike, south, SalesOrder.OrderStatus.SHIPPED, LocalDateTime.now().minusDays(3), List.of(
                item(keyboard, 2), item(cable, 5)
        ));
        createSalesOrder("ORD-004", sarah, main, SalesOrder.OrderStatus.PROCESSING, LocalDateTime.now().minusDays(4), List.of(
                item(laptop, 2), item(mouse, 6), item(oats, 20)
        ));

        createPurchaseOrder("PO-1001", techWorld, main, PurchaseOrder.PurchaseOrderStatus.ORDERED, 12450, List.of(
                poItem(laptop, 8), poItem(monitor, 10)
        ));
        createPurchaseOrder("PO-1002", global, north, PurchaseOrder.PurchaseOrderStatus.SUBMITTED, 3420, List.of(
                poItem(cable, 250), poItem(keyboard, 20)
        ));
        createPurchaseOrder("PO-1003", prime, south, PurchaseOrder.PurchaseOrderStatus.RECEIVED, 1850, List.of(
                poItem(oats, 300)
        ));
    }

    private StoreBranch branch(String code, String name, String city, String state, boolean warehouse) {
        return StoreBranch.builder()
                .branchCode(code)
                .branchName(name)
                .addressLine1("100 Supply Chain Ave")
                .city(city)
                .state(state)
                .postalCode("60601")
                .country("USA")
                .phone("+1-555-0188")
                .email(code.toLowerCase() + "@demo.example.com")
                .managerName("Demo Manager")
                .openingHours("08:00-18:00")
                .timezone("America/Chicago")
                .isActive(true)
                .isWarehouse(warehouse)
                .build();
    }

    private Product product(String sku, String name, Category category, String brand, String origin, String price, String stockHint, int reorderLevel) {
        return Product.builder()
                .sku(sku)
                .barcode("BC-" + sku)
                .name(name)
                .description(name + " demo item mapped for customer supply-chain workflows. Stock hint: " + stockHint)
                .categoryId(category.getId())
                .unitPrice(new BigDecimal(price))
                .costPrice(new BigDecimal(price).multiply(new BigDecimal("0.62")))
                .weightKg(new BigDecimal("1.250"))
                .dimensionsCm("40x30x10")
                .brand(brand)
                .originCountry(origin)
                .status(Product.ProductStatus.ACTIVE)
                .reorderLevel(reorderLevel)
                .reorderQuantity(reorderLevel * 4)
                .isPerishable(name.toLowerCase().contains("oats"))
                .shelfLifeDays(name.toLowerCase().contains("oats") ? 365 : null)
                .build();
    }

    private Inventory inventory(Product product, StoreBranch branch, int quantity, int reorderLevel, String location) {
        return Inventory.builder()
                .productId(product.getId())
                .storeBranchId(branch.getId())
                .quantity(quantity)
                .reservedQuantity(Math.max(0, quantity / 12))
                .availableQuantity(quantity - Math.max(0, quantity / 12))
                .reorderLevel(reorderLevel)
                .reorderQuantity(reorderLevel * 4)
                .maxStockLevel(Math.max(300, quantity * 2))
                .lastRestockedAt(LocalDateTime.now().minusDays(7))
                .lastCountedAt(LocalDateTime.now().minusHours(9))
                .locationInStore(location)
                .batchNumber("BATCH-" + product.getSku())
                .build();
    }

    private Supplier supplier(String code, String name, String email, String phone, String contact, int leadTimeDays, boolean preferred) {
        return Supplier.builder()
                .supplierCode(code)
                .supplierName(name)
                .contactPerson(contact)
                .email(email)
                .phone(phone)
                .address("900 Vendor Park")
                .city("Austin")
                .state("TX")
                .postalCode("73301")
                .country("USA")
                .taxId("TAX-" + code)
                .paymentTerms("Net 30")
                .leadTimeDays(leadTimeDays)
                .minimumOrderAmount(500.0)
                .currency("USD")
                .isActive(true)
                .isPreferred(preferred)
                .notes("Demo supplier profile")
                .build();
    }

    private Customer customer(String uniqueId, String firstName, String lastName, String email, String city, String state) {
        return Customer.builder()
                .customerUniqueId(uniqueId)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .phone("+1-555-02" + uniqueId.substring(uniqueId.length() - 2))
                .documentType("PUBLIC")
                .documentNumber(uniqueId)
                .zipCode("00000")
                .city(city)
                .state(state)
                .country("USA")
                .isActive(true)
                .build();
    }

    private SalesOrderItem item(Product product, int quantity) {
        BigDecimal total = product.getUnitPrice().multiply(BigDecimal.valueOf(quantity));
        return SalesOrderItem.builder()
                .productId(product.getId())
                .quantity(quantity)
                .unitPrice(product.getUnitPrice())
                .discountAmount(BigDecimal.ZERO)
                .totalPrice(total)
                .build();
    }

    private void createSalesOrder(String number, Customer customer, StoreBranch branch, SalesOrder.OrderStatus status,
                                  LocalDateTime date, List<SalesOrderItem> items) {
        BigDecimal subtotal = items.stream().map(SalesOrderItem::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        SalesOrder order = salesOrderRepository.save(SalesOrder.builder()
                .orderNumber(number)
                .customer(customer)
                .storeBranch(branch)
                .status(status)
                .paymentStatus(SalesOrder.PaymentStatus.PAID)
                .orderDate(date)
                .expectedDeliveryDate(date.plusDays(3))
                .actualDeliveryDate(status == SalesOrder.OrderStatus.DELIVERED ? date.plusDays(2) : null)
                .subtotal(subtotal)
                .taxAmount(subtotal.multiply(new BigDecimal("0.0825")))
                .discountAmount(BigDecimal.ZERO)
                .shippingAmount(new BigDecimal("25.00"))
                .totalAmount(subtotal.multiply(new BigDecimal("1.0825")).add(new BigDecimal("25.00")))
                .shippingAddress(customer.getCity() + ", " + customer.getState())
                .billingAddress(customer.getCity() + ", " + customer.getState())
                .notes("Demo customer order")
                .build());

        items.forEach(item -> item.setSalesOrderId(order.getId()));
        salesOrderItemRepository.saveAll(items);
    }

    private PurchaseOrderItem poItem(Product product, int quantity) {
        BigDecimal lineTotal = product.getCostPrice().multiply(BigDecimal.valueOf(quantity));
        return PurchaseOrderItem.builder()
                .product(product)
                .orderedQuantity(quantity)
                .receivedQuantity(0)
                .unitPrice(product.getCostPrice())
                .discountPercent(BigDecimal.ZERO)
                .taxPercent(new BigDecimal("8.25"))
                .lineTotal(lineTotal)
                .expectedDeliveryDate(LocalDateTime.now().plusDays(8))
                .notes("Demo replenishment item")
                .build();
    }

    private void createPurchaseOrder(String number, Supplier supplier, StoreBranch branch, PurchaseOrder.PurchaseOrderStatus status,
                                     int amount, List<PurchaseOrderItem> items) {
        PurchaseOrder order = purchaseOrderRepository.save(PurchaseOrder.builder()
                .poNumber(number)
                .supplier(supplier)
                .storeBranch(branch)
                .orderDate(LocalDate.now().minusDays(2))
                .expectedDeliveryDate(LocalDate.now().plusDays(supplier.getLeadTimeDays()))
                .status(status)
                .totalAmount(BigDecimal.valueOf(amount))
                .taxAmount(BigDecimal.valueOf(amount).multiply(new BigDecimal("0.0825")))
                .shippingAmount(new BigDecimal("80.00"))
                .discountAmount(BigDecimal.ZERO)
                .currency("USD")
                .exchangeRate(BigDecimal.ONE)
                .notes("Demo supplier replenishment order")
                .termsConditions("Net 30")
                .approvedBy(status == PurchaseOrder.PurchaseOrderStatus.SUBMITTED ? null : "Demo Buyer")
                .approvedAt(status == PurchaseOrder.PurchaseOrderStatus.SUBMITTED ? null : LocalDateTime.now().minusDays(1))
                .createdBy("Demo Buyer")
                .build());

        items.forEach(item -> item.setPurchaseOrder(order));
        purchaseOrderItemRepository.saveAll(items);
    }
}
