package com.inventory.repository;

import com.inventory.entity.Inventory;
import com.inventory.entity.StoreBranch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProductIdAndStoreBranchId(Long productId, Long storeBranchId);
    List<Inventory> findByStoreBranchId(Long storeBranchId);
    
    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.reorderLevel AND i.storeBranchId = :branchId")
    List<Inventory> findLowStockItems(@Param("branchId") Long branchId);
    
    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.reorderLevel")
    List<Inventory> findAllLowStockItems();
    
    @Query("SELECT i FROM Inventory i WHERE i.storeBranchId = :branchId AND (i.product.name LIKE %:keyword% OR i.product.sku LIKE %:keyword%)")
    Page<Inventory> searchInventory(@Param("branchId") Long branchId, @Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT SUM(i.quantity) FROM Inventory i WHERE i.productId = :productId")
    Long getTotalStockForProduct(@Param("productId") Long productId);
}