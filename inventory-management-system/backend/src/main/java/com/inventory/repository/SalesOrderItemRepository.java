package com.inventory.repository;

import com.inventory.entity.SalesOrderItem;
import com.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, Long> {
    List<SalesOrderItem> findBySalesOrderId(Long salesOrderId);
    List<SalesOrderItem> findByProductId(Long productId);
    
    @Query("SELECT SUM(oi.quantity) FROM SalesOrderItem oi WHERE oi.productId = :productId AND oi.salesOrder.orderDate BETWEEN :start AND :end")
    Long getTotalQuantitySold(@Param("productId") Long productId, @Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);
    
    @Query("SELECT SUM(oi.totalPrice) FROM SalesOrderItem oi WHERE oi.productId = :productId AND oi.salesOrder.orderDate BETWEEN :start AND :end")
    Double getTotalRevenueByProduct(@Param("productId") Long productId, @Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);
}