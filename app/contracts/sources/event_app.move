module event::event_app {
    use std::signer;
    use std::vector;
    use std::table;
    use aptos_token_objects::token;

    const E_EVENT_NOT_FOUND: u64 = 202;
    const E_ALREADY_REGISTERED: u64 = 201;
    const E_NOT_ORGANIZER: u64 = 100;
    const E_NO_SPACE: u64 = 101;

    struct Event has copy, drop, store {
        id: u64,
        name: vector<u8>,
        description: vector<u8>,
        date: u64,
        location: vector<u8>,
        organizer: address,
        max_participants: u64,
    }

    /// Global registry of events created by an address
    struct EventRegistry has key {
        events: table::Table<u64, Event>,
    }

    /// Users registered to events
    struct UserRegistrations has key {
        registered_for: table::Table<u64, bool>,
    }

    /// Organizer's approved participant list
    struct ApprovedList has key {
        approved: vector<address>,
    }

    /// Create a new event
    public entry fun create_event(
        organizer: &signer,
        id: u64,
        name: vector<u8>,
        description: vector<u8>,
        date: u64,
        location: vector<u8>,
        max_participants: u64
    ) acquires EventRegistry {
        let org_addr = signer::address_of(organizer);

        let registry = borrow_global_mut<EventRegistry>(org_addr);

        let event = Event {
            id,
            name,
            description,
            date,
            location,
            organizer: org_addr,
            max_participants,
        };

        table::add<u64, Event>(&mut registry.events, id, event);
    }
    public entry fun init_registry(creator: &signer) {
        move_to(creator, EventRegistry {
            events: table::new<u64, Event>(),
        });
    }
    
    public entry fun register_for_event_v2(
        user: &signer,
        app_creator_addr: address,
        event_id: u64
    )acquires EventRegistry, UserRegistrations {
        let user_addr = signer::address_of(user);
        let registry = borrow_global_mut<EventRegistry>(app_creator_addr);
        assert!(table::contains(&registry.events, event_id), E_EVENT_NOT_FOUND);
        let event_ref = table::borrow_mut(&mut registry.events, event_id);


        assert!(event_ref.max_participants > 0, E_NO_SPACE);
        event_ref.max_participants = event_ref.max_participants - 1;

        if (!exists<UserRegistrations>(user_addr)) {
            move_to(user, UserRegistrations {
                registered_for: table::new<u64, bool>(),
            });
        };

        let user_regs = borrow_global_mut<UserRegistrations>(user_addr);
        assert!(!table::contains(&user_regs.registered_for, event_id), E_ALREADY_REGISTERED);
        table::add<u64, bool>(&mut user_regs.registered_for, event_id);
    }

    public entry fun approve_participant(
        organizer: &signer,
        event_id: u64,
        participant: address
    ) acquires EventRegistry, ApprovedList {
        let org_addr = signer::address_of(organizer);
        let registry = borrow_global_mut<EventRegistry>(org_addr);
        assert!(table::contains(&registry.events, event_id), E_EVENT_NOT_FOUND);
        let event = table::borrow_mut(&mut registry.events, event_id);
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

    public entry fun mint_pass_for_user(
        creator: &signer,
        recipient: address,
        collection: vector<u8>,
        token_name: vector<u8>,
        description: vector<u8>,
        uri: vector<u8>
    ) {
        let token_id = aptos_token_objects::mint(
            creator,
            collection,
            token_name,
            description,
            uri,
            1,
            0
        );
        aptos_token_objects::direct_transfer(creator, recipient, token_id, 1);
    }
}