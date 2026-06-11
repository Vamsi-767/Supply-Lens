package com.inventory.repository;

import com.inventory.entity.SalesOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    List<SalesOrder> findByCustomerId(Long customerId);
    List<SalesOrder> findByStoreBranchId(Long storeBranchId);
    List<SalesOrder> findByStatus(SalesOrder.OrderStatus status);
    List<SalesOrder> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
    Optional<SalesOrder> findByOrderNumber(String orderNumber);
    
    @Query("SELECT o FROM SalesOrder o WHERE o.storeBranch.id = :branchId AND o.orderDate BETWEEN :start AND :end")
    List<SalesOrder> findByBranchAndDateRange(@Param("branchId") Long branchId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(o) FROM SalesOrder o WHERE o.storeBranch.id = :branchId AND o.orderDate BETWEEN :start AND :end")
    Long countByBranchAndDateRange(@Param("branchId") Long branchId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT SUM(o.totalAmount) FROM SalesOrder o WHERE o.storeBranch.id = :branchId AND o.orderDate BETWEEN :start AND :end")
    java.math.BigDecimal getTotalSalesByBranchAndDateRange(@Param("branchId") Long branchId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT o FROM SalesOrder o WHERE o.orderNumber LIKE %:keyword% OR o.customer.firstName LIKE %:keyword% OR o.customer.lastName LIKE %:keyword%")
    Page<SalesOrder> searchOrders(@Param("keyword") String keyword, Pageable pageable);
}
