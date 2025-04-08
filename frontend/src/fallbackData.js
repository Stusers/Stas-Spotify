// fallbackData.js
export const fallbackData = {
    therapists: [
        {
            id: 1,
            title: "Dr.",
            name: "Sarah Johnson",
            email: "sarah@therapy.com",
            location: "New York",
            years_of_practice: 15,
            availability: "TAKING CLIENTS",
            image_link: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
            id: 2,
            title: "Dr.",
            name: "Michael Smith",
            email: "michael@therapy.com",
            location: "Chicago", 
            years_of_practice: 20,
            availability: "TAKING CLIENTS",
            image_link: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 3,
            title: "LMHC",
            name: "David Wilson",
            email: "david@therapy.com",
            location: "Boston",
            years_of_practice: 8,
            availability: "NOT TAKING CLIENTS",
            image_link: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
            id: 4,
            title: "Ph.D.",
            name: "Jennifer Lee",
            email: "jennifer@therapy.com",
            location: "San Francisco",
            years_of_practice: 12,
            availability: "TAKING CLIENTS",
            image_link: "https://randomuser.me/api/portraits/women/28.jpg"
        },
        {
            id: 5,
            title: "LCSW",
            name: "Robert Brown",
            email: "robert@therapy.com",
            location: "Austin",
            years_of_practice: 5,
            availability: "TAKING CLIENTS",
            image_link: "https://randomuser.me/api/portraits/men/53.jpg"
        },
        {
            id: 6,
            title: "Psy.D.",
            name: "Emily Davis",
            email: "emily@therapy.com",
            location: "Seattle",
            years_of_practice: 10,
            availability: "NOT TAKING CLIENTS",
            image_link: "https://randomuser.me/api/portraits/women/17.jpg"
        }
    ],
    clients: [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@email.com",
            phone: "555-123-4567",
            regularity: "WEEKLY",
            image_link: "https://randomuser.me/api/portraits/men/75.jpg"
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@email.com",
            phone: "555-234-5678",
            regularity: "MONTHLY",
            image_link: "https://randomuser.me/api/portraits/women/62.jpg"
        },
        {
            id: 3,
            name: "Alex Johnson",
            email: "alex@email.com",
            phone: "555-345-6789",
            regularity: "WEEKLY",
            image_link: "https://randomuser.me/api/portraits/men/41.jpg"
        },
        {
            id: 4,
            name: "Maria Garcia",
            email: "maria@email.com",
            phone: "555-456-7890",
            regularity: "WEEKLY",
            image_link: "https://randomuser.me/api/portraits/women/33.jpg"
        },
        {
            id: 5,
            name: "Sam Taylor",
            email: "sam@email.com",
            phone: "555-567-8901",
            regularity: "MONTHLY",
            image_link: "https://randomuser.me/api/portraits/men/15.jpg"
        },
        {
            id: 6,
            name: "Lisa Chen",
            email: "lisa@email.com",
            phone: "555-678-9012",
            regularity: "WEEKLY",
            image_link: "https://randomuser.me/api/portraits/women/67.jpg"
        }
    ],    sessions: [
        {
            id: 1,
            therapist_id: 1,
            client_id: 1,
            notes: "Initial consultation and assessment",
            date: "2025-04-08T14:30:00",
            length_minutes: 60,
            status: "SCHEDULED",
            payment_status: "PENDING",
            image_link: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21"
        },
        {
            id: 2,
            therapist_id: 2,
            client_id: 3,
            notes: "Discussed work-related stress strategies",
            date: "2025-04-09T10:00:00",
            length_minutes: 45,
            status: "SCHEDULED",
            payment_status: "PENDING",
            image_link: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca"
        },
        {
            id: 3,
            therapist_id: 3,
            client_id: 2,
            notes: "Family therapy session",
            date: "2025-04-10T15:00:00",
            length_minutes: 90,
            status: "SCHEDULED",
            payment_status: "PAID",
            image_link: "https://images.unsplash.com/photo-1573496130407-57329f01f769"
        },
        {
            id: 4,
            therapist_id: 4,
            client_id: 4,
            notes: "Anxiety management techniques",
            date: "2025-04-15T11:30:00",
            length_minutes: 60,
            status: "SCHEDULED",
            payment_status: "PENDING",
            image_link: "https://images.unsplash.com/photo-1541199249251-f713e6145474"
        },
        {
            id: 5,
            therapist_id: 1,
            client_id: 5,
            notes: "Depression assessment follow-up",
            date: "2025-04-09T16:00:00",
            length_minutes: 45,
            status: "SCHEDULED",
            payment_status: "WAIVED",
            image_link: "https://images.unsplash.com/photo-1591522810850-58128c5fb089"
        },
        {
            id: 6,
            therapist_id: 2,
            client_id: 6,
            notes: "Behavioral therapy session",
            date: "2025-04-15T09:00:00",
            length_minutes: 60,
            status: "SCHEDULED",
            payment_status: "PAID",
            image_link: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"
        }
    ]
};