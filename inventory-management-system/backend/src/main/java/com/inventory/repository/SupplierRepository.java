package com.inventory.repository;

import com.inventory.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    Optional<Supplier> findBySupplierCode(String supplierCode);
    
    List<Supplier> findByIsActiveTrue();
    
    @Query("SELECT s FROM Supplier s WHERE s.supplierName LIKE %:search% OR s.supplierCode LIKE %:search% OR s.contactPerson LIKE %:search%")
    List<Supplier> searchSuppliers(@Param("search") String search);
}
