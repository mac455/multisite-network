# Multi-Site Enterprise Network Lab (Full Build)
<img width="1558" height="670" alt="image" src="https://github.com/user-attachments/assets/6c6cc36e-da43-4d1f-a479-fb251b9152b9" />


This document highlights the full multi-site enterprise network build, including Sites 1–3, WAN connectivity, and OSPF multi-area routing. See `Site1_Enterprise_Network_Lab.md` for deep detail of the main site and `Troubleshooting_InterVLAN_Routing.md` for the troubleshooting playbook.

---

## 1) Executive Overview
- Three-site enterprise topology with hierarchical design.  
- Site 1 uses Layer 3 switching (SVIs + HSRP).  
- Site 2 and Site 3 use Router-on-a-Stick (RoAS).  
- WAN backbone with OSPF Area 0; each site in its own stub area.  
- Fully validated end-to-end connectivity and redundancy.

---

## 2) Topology Summary
- Site 1 (London): R1, SW1 (L3), SW2 (L3), SW3 (L2), PCs (Mgmt/Sales/IT)
- Site 2 (Manchester): R2 (RoAS), SW4 (L2), PCs (Mgmt/Finance)
- Site 3 (Edinburgh): R3 (RoAS), SW5 (L2), PCs (Mgmt/HR)
- WAN: Serial point-to-point links in /30 subnets forming a triangle (R1–R2, R1–R3, R2–R3)

---

## 3) Addressing

### 3.1 Site VLANs
- Site 1:  
  - VLAN 10 Mgmt: 10.1.10.0/24 (GW HSRP VIP: 10.1.10.1)  
  - VLAN 20 Sales: 10.1.20.0/24 (GW HSRP VIP: 10.1.20.1)  
  - VLAN 30 IT: 10.1.30.0/24 (GW HSRP VIP: 10.1.30.1)
- Site 2:  
  - VLAN 10 Mgmt: 10.2.10.0/24 (GW 10.2.10.1 on R2 Fa0/0.10)  
  - VLAN 40 Finance: 10.2.40.0/24 (GW 10.2.40.1 on R2 Fa0/0.40)
- Site 3:  
  - VLAN 10 Mgmt: 10.3.10.0/24 (GW 10.3.10.1 on R3 Fa0/0.10)  
  - VLAN 50 HR: 10.3.50.0/24 (GW 10.3.50.1 on R3 Fa0/0.50)

### 3.2 Point-to-Point WAN (/30)
- R1 ↔ R2: 192.168.100.0/30  
  - R1 S0/0/0 = 192.168.100.1/30  
  - R2 S0/0/0 = 192.168.100.2/30
- R1 ↔ R3: 192.168.100.4/30  
  - R1 S0/0/1 = 192.168.100.5/30  
  - R3 S0/0/0 = 192.168.100.6/30
- R2 ↔ R3: 192.168.100.8/30  
  - R2 S0/0/1 = 192.168.100.9/30  
  - R3 S0/0/1 = 192.168.100.10/30

---

## 4) Routing with OSPF

### 4.1 Area Plan
- Area 0: WAN backbone (all serial /30 links)  
- Area 1 (stub): Site 1 local networks  
- Area 2 (stub): Site 2 local networks  
- Area 3 (stub): Site 3 local networks



## 5) Site Build Highlights

### 5.1 Site 1 (See `Site1_Enterprise_Network_Lab.md`)
- L3 switching with `ip routing` on SW1/SW2  
- HSRP virtual gateways (.1) for VLAN 10/20/30  
- Trunk links: SW1–SW3, SW2–SW3, SW1–SW2 (802.1Q)  
- OSPF adjacencies from R1 to SW1/SW2 (Area 1)

### 5.2 Site 2 (RoAS)
- R2 Fa0/0.10 = 10.2.10.1/24 (encap dot1q 10)  
- R2 Fa0/0.40 = 10.2.40.1/24 (encap dot1q 40)  
- SW4 Fa0/1 trunk to R2; Fa0/10 (VLAN 40), Fa0/20 (VLAN 10)  
- OSPF Area 2 (stub) for local networks; Area 0 for WAN

### 5.3 Site 3 (RoAS)
- R3 Fa0/0.10 = 10.3.10.1/24 (encap dot1q 10)  
- R3 Fa0/0.50 = 10.3.50.1/24 (encap dot1q 50)  
- SW5 Fa0/1 trunk to R3; Fa0/10 (VLAN 50), Fa0/20 (VLAN 10)  
- OSPF Area 3 (stub) for local networks; Area 0 for WAN

---

## 6) Validation & Tests
- OSPF neighbours: `show ip ospf neighbor` on R1/R2/R3 (FULL on all links).  
- Routing tables: `show ip route ospf` includes remote site VLANs at each router.  
- PC tests:  
  - Local VLAN → Gateway (success)  
  - Inter-VLAN within site (success)  
  - Cross-site pings: 10.1.20.10 ↔ 10.2.40.10 ↔ 10.3.50.10 (success)  
- Redundancy: HSRP failover validated at Site 1; OSPF reconverges across WAN.

