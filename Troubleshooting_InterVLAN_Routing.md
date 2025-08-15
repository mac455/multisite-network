# Inter-VLAN Connectivity Troubleshooting (Packet Tracer / Cisco IOS)


## Symptom
- PCs in different VLANs cannot ping each other (e.g., VLAN 10 Management ↔ VLAN 50 Finance).  
- Gateway pings may succeed or fail depending on where the problem lies.

---

## Quick Triage Flow
1. Verify physical/link status is up/up on all relevant ports.
2. Verify correct VLAN assignment on the PC access ports.
3. Verify trunks exist and allow the needed VLANs on both ends.
4. Verify the router/L3 switch has correct SVI or sub-interface IPs for each VLAN.
5. Ping each PC’s default gateway. If this fails, fix local VLAN first.
6. If gateway pings work, test inter-VLAN by pinging another VLAN host.  
7. If still failing, check routing device (router sub-interfaces or L3 switch SVIs) and IP routing.

---

## Core Checks 

### 1) Trunking on Switches
- Ensure the trunk uses dot1q and includes the correct VLAN IDs.  
- Allowed VLANs must match the VLANs ID.  
- Native VLAN should match on both sides (or be explicitly the same).  
- Avoid “dynamic auto”/“dynamic desirable” ambiguity; force mode trunk.

Commands:
```cisco
show interfaces trunk
show interfaces <int> switchport
show vlan brief
show spanning-tree vlan <ID>
```

Typical config snippet:
```cisco
interface gi0/1
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk allowed vlan 10,50
 description Trunk to Router/L3Switch
```

### 2) Verify Local VLAN Connectivity (PC ↔ Gateway)
- From each PC, ping its default gateway to confirm local VLAN is working.  
- If this fails, fix access port VLAN, trunk membership, or gateway SVI/sub-interface first.

Commands:
```text
PC> ipconfig / PC IP configuration panel
PC> ping <gateway>
```

### 3) Interface Status (All Devices)
- Ports must be `up/up`.  
- SVIs show `up/up` only if at least one access port in that VLAN is up (for L3 switches).

Commands:
```cisco
show ip interface brief
show interface status
```

### 4) VLAN Definition and Correct IPs
- Confirm VLAN exists and is active on the switch.  
- Confirm SVI/sub-interface IPs, masks, and VLAN IDs match the design.

Commands:
```cisco
show vlan brief
show running-config interface vlan <ID>
show running-config interface fa0/0.<ID>
```

### 5) Ping from the Routing Device (Good isolation step)
- From the router/L3 switch, ping both hosts using the appropriate source interface.  
- If router can ping both PCs but PCs cannot reach each other, check local host firewalls, ARP/MAC issues, or asymmetric VLAN tagging.

Commands:
```cisco
ping <PC-IP> source <gateway-IP>
show arp
show mac address-table vlan <ID>
```

---

## Router-on-a-Stick (RoAS) Checklist (R3/Site 3 example)
- Router physical interface to switch must be up/up.
- Create one sub-interface per VLAN with matching dot1q VLAN ID.
- Assign gateway IP on each sub-interface.
- Ensure the switch port to the router is a trunk permitting the VLANs.
- PCs use the sub-interface IPs as their default gateway.

Commands:
```cisco
! Router
show ip interface brief
show running-config interface fa0/0
show running-config interface fa0/0.<VLAN>

! Switch
show interfaces trunk
show interfaces fa0/1 switchport
show vlan brief
```

Example config (Router):
```cisco
interface fa0/0
 no shutdown
!
interface fa0/0.10
 encapsulation dot1Q 10
 ip address 10.3.10.1 255.255.255.0
!
interface fa0/0.50
 encapsulation dot1Q 50
 ip address 10.3.50.1 255.255.255.0
```

Example config (Switch access + trunk):
```cisco
interface fa0/1
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk allowed vlan 10,50
!
interface fa0/10
 switchport mode access
 switchport access vlan 50  ! Finance PC
!
interface fa0/20
 switchport mode access
 switchport access vlan 10  ! Management PC
```

RoAS pitfalls:
- Sub-interface number doesn’t have to match VLAN number, but the `encapsulation dot1Q <ID>` must match the switch VLAN ID.  
- Trunk allowed list missing a VLAN.  
- Wrong default gateway on PC.  
- Duplicate IPs or wrong masks.  

---

## Layer 3 Switch Inter-VLAN Checklist (SW1/SW2 example)
- `ip routing` must be enabled on L3 switches.  
- Create SVIs for each VLAN with correct gateway IPs.  
- Access ports assigned to correct VLANs.  
- Trunks between L2/L3 switches permit required VLANs.
- If using HSRP, verify virtual IPs and priorities.

Commands:
```cisco
show ip interface brief
show running-config | section interface Vlan
show standby brief
show interfaces trunk
show vlan brief
```

Example SVI config:
```cisco
ip routing
interface vlan 10
 ip address 10.1.10.2 255.255.255.0
!
interface vlan 20
 ip address 10.1.20.2 255.255.255.0
!
interface vlan 30
 ip address 10.1.30.2 255.255.255.0
```

Common L3 switch pitfalls:
- SVIs show `down/down` because no active access ports exist in that VLAN.  
- `ip routing` missing (then the switch won’t route between VLANs).  
- HSRP VIP not used as PC gateway, or VIP mismatched between switches.  
- STP blocking an inter-switch link (check spanning tree).  

---

## Additional Diagnostics
- Native VLAN mismatch: can cause untagged traffic issues or logs; make both sides the same.  
- DTP negotiation issues: force trunk with `switchport mode trunk`.  
- STP state: ensure forwarding on the intended path.  
- ARP entries: confirm the router learns PC MACs in the right VLAN.  
- MAC table: confirm frames are being learned on expected ports.  
- Packet Tracer Simulation mode: follow the frame path to see where it’s dropped.

Commands:
```cisco
show spanning-tree vlan <ID>
show cdp neighbors detail
show interfaces counters errors
show logging
```

---

## Minimal Working Test Matrix
1. PC ↔ its gateway (same VLAN)  
2. Router/L3 switch ↔ both PCs  
3. PC ↔ PC (different VLANs)  
4. If using HSRP: PC’s default gateway points to VIP; failover test  
5. If multi-site: OSPF routes present to remote VLANs

---

