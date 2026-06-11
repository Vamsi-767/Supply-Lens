package com.inventory.repository;

import com.inventory.entity.StoreBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
public interface StoreBranchRepository extends JpaRepository<StoreBranch, Long> {
    
    List<StoreBranch> findByIsActiveTrue();
    Optional<StoreBranch> findByBranchCode(String branchCode);

    @Query("SELECT s FROM StoreBranch s WHERE s.branchName LIKE %:search% OR s.branchCode LIKE %:search%")
    List<StoreBranch> searchBranches(@Param("search") String search);
}
