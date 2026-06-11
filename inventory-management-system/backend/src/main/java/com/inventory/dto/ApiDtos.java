package com.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public final class ApiDtos {
    private ApiDtos() {
    }

    public record DashboardSummary(
            long totalProducts,
            long lowStockAlerts,
            long totalOrders,
            BigDecimal revenue,
            BigDecimal fulfillmentRate,
            long activeSuppliers,
            List<SalesOrderResponse> recentOrders,
            List<CapacityMetric> capacity
    ) {
    }

    public record CapacityMetric(String name, int value) {
    }

    public record ProductResponse(
            Long id,
            String name,
            String sku,
            String category,
            BigDecimal price,
            Integer stock,
            String status
    ) {
    }

    public record ProductRequest(
            String name,
            String sku,
            Long categoryId,
            BigDecimal price,
            Integer reorderLevel
    ) {
    }

    public record InventoryResponse(
            Long id,
            Long productId,
            String productName,
            String sku,
            String branch,
            Integer quantity,
            Integer reorderPoint,
            String status
    ) {
    }

    public record SupplierResponse(
            Long id,
            String name,
            String email,
            String phone,
            String category,
            Integer leadTimeDays,
            BigDecimal rating,
            Boolean preferred
    ) {
    }

    public record SupplierRequest(
            String name,
            String email,
            String phone,
            String contactPerson,
            Integer leadTimeDays,
            Boolean preferred
    ) {
    }

    public record SalesOrderResponse(
            Long id,
            String orderNumber,
            String customer,
            LocalDateTime date,
            BigDecimal amount,
            String status,
            int items
    ) {
    }

    public record PurchaseOrderResponse(
            Long id,
            String poNumber,
            String supplier,
            String branch,
            LocalDate orderDate,
            LocalDate expectedDeliveryDate,
            BigDecimal amount,
            String status,
            int items
    ) {
    }

    public record CustomerResponse(
            Long id,
            String name,
            String email,
            String phone,
            String city,
            String state
    ) {
    }

    public record BranchResponse(
            Long id,
            String code,
            String name,
            String city,
            String state,
            Boolean warehouse
    ) {
    }

    public record ReportsResponse(
            BigDecimal totalRevenue,
            long totalOrders,
            BigDecimal averageOrderValue,
            BigDecimal fulfillmentRate,
            List<SalesPoint> salesTrend,
            List<TopProduct> topProducts,
            List<CategoryPerformance> categoryPerformance
    ) {
    }

    public record SalesPoint(String date, BigDecimal sales, long orders) {
    }

    public record TopProduct(String name, BigDecimal sales, long units) {
    }

    public record CategoryPerformance(String category, BigDecimal revenue, long unitsSold, String growth) {
    }
}
