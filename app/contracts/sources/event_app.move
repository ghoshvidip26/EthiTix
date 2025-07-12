module event::event_app {
    use std::signer;
    use std::vector;
    use std::table;

    const E_EVENT_NOT_FOUND: u64 = 202;
    const E_ALREADY_REGISTERED: u64 = 201;
    const E_NOT_ORGANIZER: u64 = 100;
    const E_NO_SPACE: u64 = 101;
    const E_EVENT_ALREADY_EXISTS: u64 = 102;

    struct Event has copy, drop, store {
        name: vector<u8>,
        description: vector<u8>,
        date: u64,
        location: vector<u8>,
        organizer: address,
        max_participants: u64,
    }

    struct EventRegistry has key {
        events: table::Table<vector<u8>, Event>,
    }

    /// Users registered to events
    struct UserRegistrations has key {
        registered_for: table::Table<vector<u8>, bool>,
    }

    /// Organizer's approved participant list
    struct ApprovedList has key {
        approved: vector<address>,
    }

    /// Create a new event
    public entry fun create_event(
        organizer: &signer,
        name: vector<u8>,
        description: vector<u8>,
        date: u64,
        location: vector<u8>,
        max_participants: u64
    ) acquires EventRegistry {
        let org_addr = signer::address_of(organizer);
        let registry = borrow_global_mut<EventRegistry>(org_addr);
        assert!(!table::contains(&registry.events, name), E_EVENT_ALREADY_EXISTS);

        let event = Event {
            name,
            description,
            date,
            location,
            organizer: org_addr,
            max_participants,
        };

        table::add<vector<u8>, Event>(&mut registry.events, name, event);
    }

    public fun get_event(addr: address, name: vector<u8>): Event acquires EventRegistry {
        let registry = borrow_global<EventRegistry>(addr);
        let event_ref = table::borrow(&registry.events, name);
        *event_ref
    }

    public entry fun init_registry(creator: &signer){
        move_to(creator, EventRegistry {
            events: table::new<vector<u8>, Event>(),
        });
    }
    
    public entry fun register_for_event_v2(
        user: &signer,
        app_creator_addr: address,
        event_name: vector<u8>,
    )acquires EventRegistry, UserRegistrations {
        let user_addr = signer::address_of(user);
        let registry = borrow_global_mut<EventRegistry>(app_creator_addr);
        assert!(table::contains(&registry.events, event_name), E_EVENT_NOT_FOUND);
        let event_ref = table::borrow_mut(&mut registry.events, event_name);
        
        assert!(event_ref.max_participants > 0, E_NO_SPACE);
        event_ref.max_participants = event_ref.max_participants - 1;

        if (!exists<UserRegistrations>(user_addr)) {
            move_to(user, UserRegistrations {
                registered_for: table::new<vector<u8>, bool>(),
            });
        };

        let user_regs = borrow_global_mut<UserRegistrations>(user_addr);
        assert!(!table::contains(&user_regs.registered_for, event_name), E_ALREADY_REGISTERED);
        table::add<vector<u8>, bool>(&mut user_regs.registered_for, event_name,true);
    }

    public entry fun approve_participant(
        organizer: &signer,
        event_name: vector<u8>,
        participant: address
    ) acquires EventRegistry, ApprovedList {
        let org_addr = signer::address_of(organizer);
        let registry = borrow_global_mut<EventRegistry>(org_addr);
        assert!(table::contains(&registry.events, event_name), E_EVENT_NOT_FOUND);
        let event = table::borrow_mut(&mut registry.events, event_name);
        assert!(event.organizer == org_addr, E_NOT_ORGANIZER);
        assert!(event.max_participants > 0, E_NO_SPACE);

        event.max_participants = event.max_participants - 1;

        if (!exists<ApprovedList>(org_addr)) {
            move_to(organizer, ApprovedList {
                approved: vector::empty<address>(),
            });
        };
        let list_ref = borrow_global_mut<ApprovedList>(org_addr);
        
        vector::push_back(&mut list_ref.approved, participant);
    }
}