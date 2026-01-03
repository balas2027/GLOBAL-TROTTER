from app import create_app, db
from sqlalchemy import text

app = create_app()

def escape_str(s):
    return s.replace("'", "''")

updates = {
    # KYOTO VARIATIONS
    6: {
        "title": "Kyoto Cherry Blossom Special",
        "desc": "Witness the magical Sakura season in Kyoto. Visit Maruyama Park and the Philosopher's Path at their peak beauty.",
        "budget": 3200, "dist": 4800, "start": "2026-03-25", "end": "2026-04-05"
    },
    10: {
        "title": "Historical Kyoto & Temples",
        "desc": "A deep dive into Kyoto's rich history. Explore Kinkaku-ji, Fushimi Inari, and ancient tea houses in Gion.",
        "budget": 2800, "dist": 4800, "start": "2026-05-10", "end": "2026-05-18"
    },
    14: {
        "title": "Kyoto Culinary Journey",
        "desc": "Taste the best of Kaiseki dining, street food in Nishiki Market, and matcha experiences in Uji.",
        "budget": 3500, "dist": 4800, "start": "2026-09-15", "end": "2026-09-22"
    },
    22: {
        "title": "Autumn Colors in Kyoto",
        "desc": "See the stunning red maple leaves at Kiyomizu-dera and Eikando Zenrinji. A photographer's dream.",
        "budget": 3100, "dist": 4800, "start": "2026-11-10", "end": "2026-11-20"
    },
    23: {
        "title": "Kyoto Zen Gardens Retreat",
        "desc": "Find inner peace visiting the rock garden of Ryoan-ji and meditating in serene temple grounds.",
        "budget": 2500, "dist": 4800, "start": "2026-10-01", "end": "2026-10-08"
    },

    # ICELAND VARIATIONS
    7: {
        "title": "Iceland Ring Road Adventure",
        "desc": "The ultimate road trip around Route 1. Waterfalls, black sand beaches, and the Blue Lagoon.",
        "budget": 4500, "dist": 1332, "start": "2026-06-15", "end": "2026-06-25"
    },
    11: {
        "title": "Northern Lights Hunt",
        "desc": "Chase the Aurora Borealis in the dark winter nights. Includes detailed guides for optimal viewing spots.",
        "budget": 3800, "dist": 1332, "start": "2026-01-20", "end": "2026-01-28"
    },
    15: {
        "title": "Iceland Glaciers & Volcanoes",
        "desc": "Hike the Skaftafell glacier and visit the active volcanic sites. For the adventurous soul.",
        "budget": 4200, "dist": 1332, "start": "2026-08-05", "end": "2026-08-15"
    },
    19: {
        "title": "Summer Solstice in Reykjavik",
        "desc": "Experience the Midnight Sun. Festivals, nightlife, and 24-hour daylight exploration.",
        "budget": 3600, "dist": 1332, "start": "2026-06-20", "end": "2026-06-27"
    },

    # BALI VARIATIONS
    8: {
        "title": "Bali Wellness & Yoga",
        "desc": "Rejuvenate in Ubud with daily yoga sessions, organic food, and visits to sacred water temples.",
        "budget": 2000, "dist": 3000, "start": "2026-02-10", "end": "2026-02-24"
    },
    12: {
        "title": "Bali Beach Hopping",
        "desc": "Relax on the white sands of Nusa Dua, Uluwatu, and Seminyak. Sun, surf, and cocktails.",
        "budget": 2200, "dist": 3000, "start": "2026-11-01", "end": "2026-11-14"
    },
    16: {
        "title": "Ubud Cultural Escape",
        "desc": "Immerse yourself in Balinese art, dance, and craft making. Visit the Monkey Forest and rice terraces.",
        "budget": 1800, "dist": 3000, "start": "2026-12-01", "end": "2026-12-10"
    },
    20: {
        "title": "Bali Surfing Safari",
        "desc": "Catch the best waves in Canggu and Uluwatu. Includes surf lessons and board rentals.",
        "budget": 1900, "dist": 3000, "start": "2027-01-15", "end": "2027-01-25"
    },

    # SWISS ALPS VARIATIONS
    9: {
        "title": "Swiss Alps Hiking Challenge",
        "desc": "Tackle the scenic trails of Grindelwald and Zermatt. Views of the Matterhorn guaranteed.",
        "budget": 3500, "dist": 6000, "start": "2026-07-10", "end": "2026-07-20"
    },
    13: {
        "title": "Luxury Swiss Ski Trip",
        "desc": "Stay in 5-star chalets in St. Moritz. World-class skiing and après-ski dining.",
        "budget": 6000, "dist": 6000, "start": "2026-12-20", "end": "2026-12-30"
    },
    17: {
        "title": "Interlaken Lakes & Mountains",
        "desc": "Boat tours on Lake Brienz and Lake Thun, combined with a train ride to Jungfraujoch.",
        "budget": 3800, "dist": 6000, "start": "2026-08-15", "end": "2026-08-22"
    },
    21: {
        "title": "Swiss Chocolate & Trains Tour",
        "desc": "Ride the Glacier Express and visit the Cailler chocolate factory. A treat for all senses.",
        "budget": 3200, "dist": 6000, "start": "2026-09-05", "end": "2026-09-12"
    }
}

with app.app_context():
    print("Updating trips with unique details...")
    for tid, data in updates.items():
        check = db.session.execute(text(f"SELECT id FROM trips WHERE id = {tid}")).fetchone()
        if check:
            sql = f"""
                UPDATE trips 
                SET title = '{escape_str(data["title"])}',
                    description = '{escape_str(data["desc"])}',
                    budget_limit = {data["budget"]},
                    distance = {data["dist"]},
                    start_date = '{data["start"]}',
                    end_date = '{data["end"]}'
                WHERE id = {tid}
            """
            db.session.execute(text(sql))
            print(f" -> Updated Trip {tid}: {data['title']}")
        else:
            print(f" -> Trip {tid} not found.")

    db.session.commit()
    print("Update complete!")
