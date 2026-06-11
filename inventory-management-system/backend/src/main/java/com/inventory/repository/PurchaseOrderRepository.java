package com.inventory.repository;

import com.inventory.entity.PurchaseOrder;
import com.inventory.entity.PurchaseOrder.PurchaseOrderStatus;
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
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    
    Optional<PurchaseOrder> findByPoNumber(String poNumber);
    
    Page<PurchaseOrder> findByStatus(PurchaseOrderStatus status, Pageable pageable);
    
    Page<PurchaseOrder> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    @Query("SELECT po FROM PurchaseOrder po WHERE po.supplier.id = :supplierId AND po.status = :status")
    List<PurchaseOrder> findBySupplierIdAndStatus(@Param("supplierId") Long supplierId, @Param("status") PurchaseOrderStatus status);
    
    @Query("SELECT COUNT(po) FROM PurchaseOrder po WHERE po.supplier.id = :supplierId AND po.status = :status")
    Long countBySupplierIdAndStatus(@Param("supplierId") Long supplierId, @Param("status") PurchaseOrderStatus status);
    
    @Query("SELECT SUM(po.totalAmount) FROM PurchaseOrder po WHERE po.supplier.id = :supplierId AND po.status = :status")
    java.math.BigDecimal getTotalAmountBySupplierAndStatus(@Param("supplierId") Long supplierId, @Param("status") PurchaseOrderStatus status);
}
