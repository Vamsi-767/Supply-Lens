package com.inventory.repository;

import com.inventory.entity.PurchaseOrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderItemRepository extends JpaRepository<PurchaseOrderItem, Long> {
    
    List<PurchaseOrderItem> findByPurchaseOrder_Id(Long purchaseOrderId);
    
    Page<PurchaseOrderItem> findByPurchaseOrder_Id(Long purchaseOrderId, Pageable pageable);
    
    List<PurchaseOrderItem> findByProduct_Id(Long productId);
    
    @Query("SELECT SUM(poi.orderedQuantity) FROM PurchaseOrderItem poi WHERE poi.product.id = :productId AND poi.purchaseOrder.status = 'RECEIVED'")
    Integer getTotalReceivedQuantityByProductId(@Param("productId") Long productId);
    
    @Query("SELECT SUM(poi.lineTotal) FROM PurchaseOrderItem poi WHERE poi.purchaseOrder.supplier.id = :supplierId AND poi.purchaseOrder.status = 'RECEIVED'")
    java.math.BigDecimal getTotalCostBySupplierId(@Param("supplierId") Long supplierId);
}
