# Multi-Site Expansion: Site 2, Site 3, and WAN (OSPF Multi-Area)


## Design Overview

- Site 1 (London): Implemented with Layer 3 switching, HSRP, OSPF Area 1 (stub)
- Site 2 (Manchester): Router-on-a-Stick with Layer 2 access switch, OSPF Area 2 (stub)
- Site 3 (Edinburgh): Router-on-a-Stick with Layer 2 access switch, OSPF Area 3 (stub)
- WAN: Serial links in OSPF Area 0 backbone (R1↔R2, R1↔R3)

---

## Addressing Plan

### WAN (Area 0)
- R1↔R2: 192.168.100.0/30  
  - R1 s0/0/0: 192.168.100.1  
  - R2 s0/0/0: 192.168.100.2
- R1↔R3: 192.168.100.4/30  
  - R1 s0/0/1: 192.168.100.5  
  - R3 s0/0/0: 192.168.100.6

### Site 2 (Area 2 - Stub)
- VLAN 10 (Management): 10.2.10.0/24  (GW 10.2.10.1)
- VLAN 40 (Finance): 10.2.40.0/24     (GW 10.2.40.1)

### Site 3 (Area 3 - Stub)
- VLAN 10 (Management): 10.3.10.0/24  (GW 10.3.10.1)
- VLAN 50 (HR): 10.3.50.0/24          (GW 10.3.50.1)

---

## Hardware & Cabling

### Modules (Routers R1, R2, R3)
- Power off each router (Physical tab)
- Install one `WIC-2T` module
- Power on

### WAN Cabling
- `R1 s0/0/0` ↔ `R2 s0/0/0` (Serial DCE/DTE cable)
- `R1 s0/0/1` ↔ `R3 s0/0/0` (Serial DCE/DTE cable)
- Set clock rate on DCE ends: `clock rate 64000`

### Site 2 Cabling
- R2 `Fa0/0` ↔ SW4 `Gi0/1` (Router-on-a-Stick trunk)
- SW4 `Fa0/1` → Finance PC, `Fa0/2` → Mgmt PC

### Site 3 Cabling
- R3 `Fa0/0` ↔ SW5 `Gi0/1` (Router-on-a-Stick trunk)
- SW5 `Fa0/1` → HR PC, `Fa0/2` → Mgmt PC

---

## Configurations

### 1) R1 (London) – Add WAN & OSPF Area 0
```cisco
! Serial links
interface serial0/0/0
 ip address 192.168.100.1 255.255.255.252
 clock rate 64000
 no shutdown
!
interface serial0/0/1
 ip address 192.168.100.5 255.255.255.252
 clock rate 64000
 no shutdown
!
router ospf 1
 router-id 1.1.1.1
 network 192.168.100.0 0.0.0.7 area 0
! (existing) network 10.1.1.0 0.0.0.15 area 1
```

### 2) R2 (Manchester) – Router-on-a-Stick + OSPF Area 2 (stub)
```cisco
hostname R2
!
interface fastethernet0/0
 no ip address
!
interface fastethernet0/0.10
 encapsulation dot1q 10
 ip address 10.2.10.1 255.255.255.0
 description Management VLAN GW
!
interface fastethernet0/0.40
 encapsulation dot1q 40
 ip address 10.2.40.1 255.255.255.0
 description Finance VLAN GW
!
interface serial0/0/0
 ip address 192.168.100.2 255.255.255.252
 no shutdown
!
router ospf 1
 router-id 2.2.2.2
 network 192.168.100.0 0.0.0.3 area 0
 network 10.2.10.0 0.0.0.255 area 2
 network 10.2.40.0 0.0.0.255 area 2
 area 2 stub
```

### 3) SW4 (Manchester) – VLANs + Trunk + Access Ports
```cisco
hostname SW4
!
vlan 10
 name Management
vlan 40
 name Finance
!
interface gigabitethernet0/1
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk allowed vlan 10,40
 description Trunk to R2
!
interface fastethernet0/1
 switchport mode access
 switchport access vlan 40
 description Finance PC
!
interface fastethernet0/2
 switchport mode access
 switchport access vlan 10
 description Management PC
```

### 4) R3 (Edinburgh) – Router-on-a-Stick + OSPF Area 3 (stub)
```cisco
hostname R3
!
interface fastethernet0/0
 no ip address
!
interface fastethernet0/0.10
 encapsulation dot1q 10
 ip address 10.3.10.1 255.255.255.0
 description Management VLAN GW
!
interface fastethernet0/0.50
 encapsulation dot1q 50
 ip address 10.3.50.1 255.255.255.0
 description HR VLAN GW
!
interface serial0/0/0
 ip address 192.168.100.6 255.255.255.252
 no shutdown
!
router ospf 1
 router-id 3.3.3.3
 network 192.168.100.4 0.0.0.3 area 0
 network 10.3.10.0 0.0.0.255 area 3
 network 10.3.50.0 0.0.0.255 area 3
 area 3 stub
```

### 5) SW5 (Edinburgh) – VLANs + Trunk + Access Ports
```cisco
hostname SW5
!
vlan 10
 name Management
vlan 50
 name HR
!
interface gigabitethernet0/1
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk allowed vlan 10,50
 description Trunk to R3
!
interface fastethernet0/1
 switchport mode access
 switchport access vlan 50
 description HR PC
!
interface fastethernet0/2
 switchport mode access
 switchport access vlan 10
 description Management PC
```

### 6) PC Addressing
- Site 2 Finance PC: 10.2.40.10/24, GW 10.2.40.1  
- Site 2 Mgmt PC: 10.2.10.10/24, GW 10.2.10.1  
- Site 3 HR PC: 10.3.50.10/24, GW 10.3.50.1  
- Site 3 Mgmt PC: 10.3.10.10/24, GW 10.3.10.1

---

## Verification & Testing

### OSPF Neighborships
```
R1# show ip ospf neighbor
R2# show ip ospf neighbor
R3# show ip ospf neighbor
```
Expect: R1↔R2 on s0/0/0, R1↔R3 on s0/0/1; R2 shows Area 0 and Area 2; R3 shows Area 0 and Area 3.

### Routing Tables
```
R1# show ip route ospf
R2# show ip route
R3# show ip route
```
Expect: Each site sees other sites' VLANs via OSPF; Stub areas receive a default route from their ABR (R2/R3).

### End-to-End Pings
- Site 2 Finance PC → Site 1 Sales PC (10.1.20.10)
- Site 3 HR PC → Site 2 Management PC (10.2.10.10)
- Site 1 IT PC → Site 3 HR PC (10.3.50.10)

### Failure Tests
- Shut `R1 s0/0/0` and verify Site 2 ↔ Site 3 still reach Site 1 over their remaining link
- Shut a trunk on SW4/SW5 to confirm local resiliency

---
