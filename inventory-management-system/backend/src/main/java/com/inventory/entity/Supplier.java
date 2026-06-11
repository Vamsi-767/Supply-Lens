package com.inventory.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "suppliers", indexes = {
    @Index(name = "idx_supplier_code", columnList = "supplier_code", unique = true),
    @Index(name = "idx_supplier_name", columnList = "supplier_name"),
    @Index(name = "idx_supplier_active", columnList = "is_active"),
    @Index(name = "idx_supplier_email", columnList = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "supplier_code", length = 20, unique = true, nullable = false)
    private String supplierCode;

    @Column(name = "supplier_name", length = 150, nullable = false)
    private String supplierName;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 20)
    private String fax;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(length = 100)
    private String country;

    @Column(name = "tax_id", length = 50)
    private String taxId;

    @Column(name = "payment_terms", length = 100)
    private String paymentTerms;

    @Column(name = "lead_time_days")
    private Integer leadTimeDays = 0;

    @Column(name = "minimum_order_amount")
    private Double minimumOrderAmount = 0.0;

    @Column(name = "currency", length = 3)
    private String currency = "USD";

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_preferred")
    private Boolean isPreferred = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<PurchaseOrder> purchaseOrders;

}
