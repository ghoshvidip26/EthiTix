module event::app {
    use std::signer;
    use std::vector;

    struct Event has store {
        id: u64,
        name: vector<u8>,
        description: vector<u8>,
        date: u64,
        location: vector<u8>,
        organizer: address,
        max_participants: u64,
    }

    struct EventRegistry has key {
        events: vector<Event>,
    }
    
    struct ApprovedList has key {
        approved: vector<address>,
    }

    public entry fun register_for_event_v2(user: &signer, event_id: u64) acquires EventRegistry, ApprovedList {
        let user_addr = signer::address_of(user);

        let registry = borrow_global_mut<EventRegistry>(user_addr);
        let event = vector::borrow_mut(&mut registry.events, event_id);

        assert!(event.max_participants > 0, 101);

        event.max_participants = event.max_participants - 1;

        if (!exists<ApprovedList>(user_addr)) {
            move_to(user, ApprovedList {
                approved: vector::empty<address>(),
            });
        };

        let list_ref = borrow_global_mut<ApprovedList>(user_addr);
        vector::push_back(&mut list_ref.approved, user_addr);
    }

    public entry fun create_event(
        organizer: &signer,
        id: u64,
        name: vector<u8>,
        description: vector<u8>,
        date: u64,
        location: vector<u8>,
        max_participants: u64
    ) acquires EventRegistry {
        let _addr = signer::address_of(organizer);
        let event = Event {
            id,
            name,
            description,
            date,
            location,
            organizer: _addr,
            max_participants,
        };

        let registry = borrow_global_mut<EventRegistry>(_addr);
        vector::push_back(&mut registry.events, event);
    }

    public entry fun approve_participant(
    organizer: &signer,
    event_index: u64,
    participant: address
    ) acquires EventRegistry, ApprovedList {
        let org_addr = signer::address_of(organizer);
        let registry = borrow_global_mut<EventRegistry>(org_addr);

        let event = vector::borrow_mut(&mut registry.events, event_index);
        assert!(event.organizer == org_addr, 100);
        assert!(event.max_participants > 0, 101);

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