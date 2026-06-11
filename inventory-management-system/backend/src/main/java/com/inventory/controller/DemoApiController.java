package com.inventory.controller;

import com.inventory.dto.ApiDtos;
import com.inventory.entity.Category;
import com.inventory.entity.Inventory;
import com.inventory.entity.Product;
import com.inventory.entity.SalesOrder;
import com.inventory.entity.SalesOrderItem;
import com.inventory.entity.Supplier;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.CustomerRepository;
import com.inventory.repository.InventoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.PurchaseOrderRepository;
import com.inventory.repository.SalesOrderItemRepository;
import com.inventory.repository.SalesOrderRepository;
import com.inventory.repository.StoreBranchRepository;
import com.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DemoApiController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplierRepository supplierRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderItemRepository salesOrderItemRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CustomerRepository customerRepository;
    private final StoreBranchRepository storeBranchRepository;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "mode", "public-demo");
    }

    @GetMapping("/dashboard")
    public ApiDtos.DashboardSummary dashboard() {
        List<ApiDtos.SalesOrderResponse> recentOrders = salesOrderRepository.findAll().stream()
                .sorted(Comparator.comparing(SalesOrder::getOrderDate).reversed())
                .limit(5)
                .map(this::toSalesOrderResponse)
                .toList();

        return new ApiDtos.DashboardSummary(
                productRepository.count(),
                inventoryRepository.findAllLowStockItems().size(),
                salesOrderRepository.count(),
                totalRevenue(),
                fulfillmentRate(),
                supplierRepository.findByIsActiveTrue().size(),
                recentOrders,
                List.of(
                        new ApiDtos.CapacityMetric("Inbound receiving", 84),
                        new ApiDtos.CapacityMetric("Picking capacity", 72),
                        new ApiDtos.CapacityMetric("Dock utilization", 61),
                        new ApiDtos.CapacityMetric("Exception queue", 28)
                )
        );
    }

    @GetMapping("/products")
    public List<ApiDtos.ProductResponse> products() {
        return productRepository.findAll().stream()
                .sorted(Comparator.comparing(Product::getName))
                .map(this::toProductResponse)
                .toList();
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ApiDtos.ProductResponse createProduct(@RequestBody ApiDtos.ProductRequest request) {
        Category category = request.categoryId() == null
                ? categoryRepository.findAll().stream().findFirst().orElseThrow()
                : categoryRepository.findById(request.categoryId()).orElseThrow();

        Product product = Product.builder()
                .sku(request.sku())
                .barcode("BC-" + request.sku())
                .name(request.name())
                .description("Customer demo product")
                .categoryId(category.getId())
                .unitPrice(nvl(request.price()))
                .costPrice(nvl(request.price()).multiply(new BigDecimal("0.62")))
                .brand("Demo")
                .originCountry("USA")
                .status(Product.ProductStatus.ACTIVE)
                .reorderLevel(request.reorderLevel() == null ? 10 : request.reorderLevel())
                .reorderQuantity(50)
                .isPerishable(false)
                .build();

        return toProductResponse(productRepository.save(product));
    }

    @GetMapping("/categories")
    public List<Category> categories() {
        return categoryRepository.findAll().stream()
                .sorted(Comparator.comparing(Category::getName))
                .toList();
    }

    @GetMapping("/inventory")
    public List<ApiDtos.InventoryResponse> inventory() {
        return inventoryRepository.findAll().stream()
                .sorted(Comparator.comparing(i -> i.getProduct().getName()))
                .map(this::toInventoryResponse)
                .toList();
    }

    @GetMapping("/inventory/low-stock")
    public List<ApiDtos.InventoryResponse> lowStock() {
        return inventoryRepository.findAllLowStockItems().stream()
                .map(this::toInventoryResponse)
                .toList();
    }

    @GetMapping("/suppliers")
    public List<ApiDtos.SupplierResponse> suppliers() {
        return supplierRepository.findAll().stream()
                .sorted(Comparator.comparing(Supplier::getSupplierName))
                .map(this::toSupplierResponse)
                .toList();
    }

    @PostMapping("/suppliers")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ApiDtos.SupplierResponse createSupplier(@RequestBody ApiDtos.SupplierRequest request) {
        Supplier supplier = Supplier.builder()
                .supplierCode("SUP-" + (supplierRepository.count() + 1))
                .supplierName(request.name())
                .contactPerson(request.contactPerson())
                .email(request.email())
                .phone(request.phone())
                .city("Demo City")
                .state("Demo State")
                .country("USA")
                .paymentTerms("Net 30")
                .leadTimeDays(request.leadTimeDays() == null ? 7 : request.leadTimeDays())
                .minimumOrderAmount(500.0)
                .currency("USD")
                .isActive(true)
                .isPreferred(Boolean.TRUE.equals(request.preferred()))
                .notes("Created from public demo UI")
                .build();

        return toSupplierResponse(supplierRepository.save(supplier));
    }

    @GetMapping("/orders")
    public List<ApiDtos.SalesOrderResponse> orders() {
        return salesOrderRepository.findAll().stream()
                .sorted(Comparator.comparing(SalesOrder::getOrderDate).reversed())
                .map(this::toSalesOrderResponse)
                .toList();
    }

    @GetMapping("/orders/{id}")
    public ApiDtos.SalesOrderResponse order(@PathVariable Long id) {
        return salesOrderRepository.findById(id).map(this::toSalesOrderResponse).orElseThrow();
    }

    @GetMapping("/purchase-orders")
    public List<ApiDtos.PurchaseOrderResponse> purchaseOrders() {
        return purchaseOrderRepository.findAll().stream()
                .sorted(Comparator.comparing(po -> po.getOrderDate(), Comparator.reverseOrder()))
                .map(po -> new ApiDtos.PurchaseOrderResponse(
                        po.getId(),
                        po.getPoNumber(),
                        po.getSupplier().getSupplierName(),
                        po.getStoreBranch().getBranchName(),
                        po.getOrderDate(),
                        po.getExpectedDeliveryDate(),
                        po.getTotalAmount(),
                        po.getStatus().name(),
                        po.getItems().size()
                ))
                .toList();
    }

    @GetMapping("/customers")
    public List<ApiDtos.CustomerResponse> customers() {
        return customerRepository.findAll().stream()
                .map(customer -> new ApiDtos.CustomerResponse(
                        customer.getId(),
                        customer.getFullName(),
                        customer.getEmail(),
                        customer.getPhone(),
                        customer.getCity(),
                        customer.getState()
                ))
                .toList();
    }

    @GetMapping("/branches")
    public List<ApiDtos.BranchResponse> branches() {
        return storeBranchRepository.findAll().stream()
                .map(branch -> new ApiDtos.BranchResponse(
                        branch.getId(),
                        branch.getBranchCode(),
                        branch.getBranchName(),
                        branch.getCity(),
                        branch.getState(),
                        branch.getIsWarehouse()
                ))
                .toList();
    }

    @GetMapping("/reports")
    public ApiDtos.ReportsResponse reports() {
        List<ApiDtos.SalesPoint> trend = salesOrderRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().toLocalDate().format(DateTimeFormatter.ofPattern("MMM d")),
                        LinkedHashMap::new,
                        Collectors.toList()
                ))
                .entrySet().stream()
                .map(entry -> new ApiDtos.SalesPoint(
                        entry.getKey(),
                        entry.getValue().stream().map(SalesOrder::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add),
                        entry.getValue().size()
                ))
                .toList();

        List<ApiDtos.TopProduct> topProducts = salesOrderItemRepository.findAll().stream()
                .collect(Collectors.groupingBy(SalesOrderItem::getProductId))
                .entrySet().stream()
                .map(entry -> {
                    Product product = productRepository.findById(entry.getKey()).orElse(null);
                    String name = product == null ? "Unknown" : product.getName();
                    BigDecimal sales = entry.getValue().stream().map(SalesOrderItem::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
                    long units = entry.getValue().stream().mapToLong(SalesOrderItem::getQuantity).sum();
                    return new ApiDtos.TopProduct(name, sales, units);
                })
                .sorted(Comparator.comparing(ApiDtos.TopProduct::sales).reversed())
                .limit(5)
                .toList();

        List<ApiDtos.CategoryPerformance> categoryPerformance = salesOrderItemRepository.findAll().stream()
                .map(item -> productRepository.findById(item.getProductId()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(product -> product.getCategory().getName()))
                .entrySet().stream()
                .map(entry -> {
                    String category = entry.getKey();
                    List<Long> productIds = entry.getValue().stream().map(Product::getId).toList();
                    List<SalesOrderItem> items = salesOrderItemRepository.findAll().stream()
                            .filter(item -> productIds.contains(item.getProductId()))
                            .toList();
                    BigDecimal revenue = items.stream().map(SalesOrderItem::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
                    long units = items.stream().mapToLong(SalesOrderItem::getQuantity).sum();
                    return new ApiDtos.CategoryPerformance(category, revenue, units, "+12%");
                })
                .toList();

        return new ApiDtos.ReportsResponse(
                totalRevenue(),
                salesOrderRepository.count(),
                averageOrderValue(),
                fulfillmentRate(),
                trend,
                topProducts,
                categoryPerformance
        );
    }

    private ApiDtos.ProductResponse toProductResponse(Product product) {
        Integer stock = inventoryRepository.getTotalStockForProduct(product.getId()) == null
                ? 0
                : inventoryRepository.getTotalStockForProduct(product.getId()).intValue();
        String category = product.getCategory() == null ? "Uncategorized" : product.getCategory().getName();
        return new ApiDtos.ProductResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                category,
                product.getUnitPrice(),
                stock,
                product.getStatus().name()
        );
    }

    private ApiDtos.InventoryResponse toInventoryResponse(Inventory item) {
        return new ApiDtos.InventoryResponse(
                item.getId(),
                item.getProductId(),
                item.getProduct().getName(),
                item.getProduct().getSku(),
                item.getStoreBranch().getBranchName(),
                item.getQuantity(),
                item.getReorderLevel(),
                item.getQuantity() <= item.getReorderLevel()
                        ? "Critical"
                        : item.getQuantity() > item.getReorderLevel() * 5 ? "Excellent" : "Good"
        );
    }

    private ApiDtos.SupplierResponse toSupplierResponse(Supplier supplier) {
        BigDecimal rating = Boolean.TRUE.equals(supplier.getIsPreferred()) ? new BigDecimal("4.9") : new BigDecimal("4.5");
        return new ApiDtos.SupplierResponse(
                supplier.getId(),
                supplier.getSupplierName(),
                supplier.getEmail(),
                supplier.getPhone(),
                Boolean.TRUE.equals(supplier.getIsPreferred()) ? "Preferred" : "Standard",
                supplier.getLeadTimeDays(),
                rating,
                supplier.getIsPreferred()
        );
    }

    private ApiDtos.SalesOrderResponse toSalesOrderResponse(SalesOrder order) {
        return new ApiDtos.SalesOrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getCustomer().getFullName(),
                order.getOrderDate(),
                order.getTotalAmount(),
                displayStatus(order.getStatus()),
                order.getOrderItems().size()
        );
    }

    private BigDecimal totalRevenue() {
        return salesOrderRepository.findAll().stream()
                .map(SalesOrder::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal averageOrderValue() {
        long count = salesOrderRepository.count();
        if (count == 0) {
            return BigDecimal.ZERO;
        }
        return totalRevenue().divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal fulfillmentRate() {
        long count = salesOrderRepository.count();
        if (count == 0) {
            return BigDecimal.ZERO;
        }
        long fulfilled = salesOrderRepository.findAll().stream()
                .filter(order -> order.getStatus() == SalesOrder.OrderStatus.DELIVERED || order.getStatus() == SalesOrder.OrderStatus.SHIPPED)
                .count();
        return BigDecimal.valueOf(fulfilled * 100.0 / count).setScale(1, RoundingMode.HALF_UP);
    }

    private String displayStatus(SalesOrder.OrderStatus status) {
        return switch (status) {
            case DELIVERED -> "Completed";
            case SHIPPED -> "In Transit";
            case PROCESSING -> "Processing";
            case CONFIRMED -> "Confirmed";
            case CANCELLED -> "Cancelled";
            case RETURNED -> "Returned";
            default -> "Pending";
        };
    }

    private BigDecimal nvl(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
