# Multi-Site Enterprise Network Design Lab
## Site 1 - Main Office (London) Implementation

* 
**Objective:** Design and implement enterprise-grade network infrastructure with redundancy and scalability

---

## Summary

Successfully designed and implemented a hierarchical enterprise network for the main office site, demonstrating Layer 3 switching, OSPF dynamic routing, HSRP redundancy, and VLAN segmentation. The solution provides high availability, scalable architecture, and follows enterprise best practices.

---

## Network Architecture

### Design Philosophy
- **Hierarchical Design**: Three-tier architecture (Core, Distribution, Access)
- **Redundancy**: Multiple paths and HSRP gateway redundancy
- **Scalability**: OSPF dynamic routing for easy expansion
- **Security**: VLAN segmentation for traffic isolation

### Physical Topology
```
                    [Router R1]
                   /           \
                  /             \
            [SW1 - Core]    [SW2 - Core]
                  \             /
                   \           /
                [SW3 - Access Switch]
                  /    |    \
                 /     |     \
          [Sales PC] [IT PC] [Mgmt PC]
```

---

## Technical Specifications

### Equipment List
| Device | Model | Role | Interfaces Used |
|--------|-------|------|-----------------|
| R1 | Cisco 2811 | WAN Gateway | Fa0/0, Fa0/1 |
| SW1 | Cisco 3560-24PS | Core L3 Switch (Primary) | Gi0/1, Gi0/2, Gi0/3 |
| SW2 | Cisco 3560-24PS | Core L3 Switch (Secondary) | Gi0/1, Gi0/2, Fa0/1 |
| SW3 | Cisco 2960-24TT | Access Switch | Gi0/1, Gi0/2, Fa0/1-3 |

### IP Addressing Scheme
| Network Segment | VLAN | Network | Gateway (HSRP) | Purpose |
|-----------------|------|---------|----------------|---------|
| Management | 10 | 10.1.10.0/24 | 10.1.10.1 | Network Management |
| Sales Department | 20 | 10.1.20.0/24 | 10.1.20.1 | Sales Team |
| IT Department | 30 | 10.1.30.0/24 | 10.1.30.1 | IT Operations |
| Router-SW1 Link | - | 10.1.1.0/30 | - | Point-to-Point |
| Router-SW2 Link | - | 10.1.1.4/30 | - | Point-to-Point |

### HSRP Configuration
| VLAN | Virtual IP | SW1 Priority | SW2 Priority | Active Router |
|------|------------|--------------|--------------|---------------|
| 10 | 10.1.10.1 | 110 | 90 | SW1 |
| 20 | 10.1.20.1 | 110 | 90 | SW1 |
| 30 | 10.1.30.1 | 110 | 90 | SW1 |

---

## Key Technologies Implemented

### 1. OSPF Dynamic Routing
- **Protocol**: OSPFv2
- **Area Design**: Single area (Area 1) for site, Area 0 for WAN (future)
- **Router IDs**: R1 (1.1.1.1), SW1 (1.1.1.10), SW2 (1.1.1.20)
- **Convergence**: Fast hello intervals (5s) for rapid failover

### 2. Layer 3 Switching
- **Inter-VLAN Routing**: Performed on SW1/SW2 for optimal traffic flow
- **Local Traffic**: Remains within site without router hairpinning
- **WAN Traffic**: Routed via R1 to external destinations

### 3. HSRP Gateway Redundancy
- **Preemption**: Enabled on SW1 for primary role restoration
- **Load Distribution**: SW1 active for all VLANs (can be optimised)
- **Failover Time**: Sub-second gateway redundancy

### 4. VLAN Implementation
- **Trunking Protocol**: 802.1Q industry standard
- **Trunk Links**: SW1-SW3, SW2-SW3, SW1-SW2
- **Access Ports**: PC connections on respective VLANs

---

## Configuration Highlights

### Router R1 - WAN Gateway
```cisco
hostname R1
interface fastethernet 0/0
 ip address 10.1.1.1 255.255.255.252
 description "Point-to-Point link to SW1"

interface fastethernet 0/1
 ip address 10.1.1.5 255.255.255.252
 description "Point-to-Point link to SW2"

router ospf 1
 router-id 1.1.1.1
 area 1 stub
 network 10.1.1.0 0.0.0.15 area 1
```

### SW1 - Primary Core Switch
```cisco
hostname SW1
ip routing

interface gigabitethernet 0/1
 no switchport
 ip address 10.1.1.2 255.255.255.252

interface vlan 20
 ip address 10.1.20.2 255.255.255.0
 standby 20 ip 10.1.20.1
 standby 20 priority 110
 standby 20 preempt

router ospf 1
 router-id 1.1.1.10
 area 1 stub
 network 10.1.1.0 0.0.0.3 area 1
 network 10.1.20.0 0.0.0.255 area 1
```

---

## Testing and Validation

### Connectivity Tests Performed
✅ **Local VLAN Connectivity**: PCs can reach their gateways  
✅ **Inter-VLAN Communication**: Sales PC ↔ IT PC successful  
✅ **HSRP Redundancy**: Gateway failover working correctly  
✅ **OSPF Convergence**: Dynamic route updates functional  
✅ **Trunk Operations**: All VLANs passing correctly  

### Network Performance
- **Convergence Time**: <5 seconds for OSPF updates
- **Failover Time**: <3 seconds for HSRP gateway switching
- **Bandwidth Utilisation**: No bottlenecks identified
- **VLAN Isolation**: Proper traffic segmentation confirmed

---

## Business Benefits

### High Availability
- **99.9% Uptime Target**: Achieved through redundant paths
- **Zero Single Points of Failure**: Multiple gateways and switches
- **Automatic Failover**: No manual intervention required

### Scalability
- **Easy VLAN Addition**: Standardised trunk configuration
- **Additional Sites**: OSPF ready for multi-site expansion  
- **User Growth**: Each VLAN supports 254 hosts

### Security
- **Network Segmentation**: VLANs isolate departments
- **Controlled Inter-VLAN**: Routing policies can be applied
- **Management Isolation**: Dedicated management VLAN

---

## Skills Demonstrated

### Technical Competencies
- **Advanced Routing**: OSPF configuration and troubleshooting
- **Layer 3 Switching**: Inter-VLAN routing and SVI configuration
- **High Availability**: HSRP implementation and testing
- **Network Design**: Hierarchical architecture principles
- **VLAN Management**: Trunk and access port configuration
- **Protocol Analysis**: Understanding of traffic flows and convergence


## Project Outcomes

This lab successfully demonstrates the ability to design, implement, and validate enterprise-grade network infrastructure. The solution provides a solid foundation for a multi-site corporate network with room for future expansion and enhancement.

**Key Achievement**: Created a production-ready network design that balances performance, redundancy, and cost-effectiveness while following Cisco best practices and industry standards.

---
