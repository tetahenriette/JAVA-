-- Insert sample airlines
INSERT INTO airlines (name, code, logo_url) VALUES
('American Airlines', 'AA', 'https://example.com/aa.png'),
('United Airlines', 'UA', 'https://example.com/ua.png'),
('Delta Airlines', 'DL', 'https://example.com/dl.png'),
('Southwest Airlines', 'SW', 'https://example.com/sw.png');

-- Insert sample airports
INSERT INTO airports (name, code, city, country) VALUES
('Los Angeles International', 'LAX', 'Los Angeles', 'USA'),
('John F. Kennedy International', 'JFK', 'New York', 'USA'),
('Chicago O''Hare International', 'ORD', 'Chicago', 'USA'),
('San Francisco International', 'SFO', 'San Francisco', 'USA'),
('Miami International', 'MIA', 'Miami', 'USA'),
('Hartsfield-Jackson Atlanta', 'ATL', 'Atlanta', 'USA'),
('London Heathrow', 'LHR', 'London', 'UK'),
('Paris Charles de Gaulle', 'CDG', 'Paris', 'France');

-- Insert sample aircraft
INSERT INTO aircraft (airline_id, model, registration, total_seats) VALUES
(1, 'Boeing 747', 'N7478A', 416),
(1, 'Airbus A380', 'N1001A', 555),
(2, 'Boeing 787', 'N27901', 242),
(2, 'Airbus A350', 'N20103', 325),
(3, 'Boeing 777', 'N701DL', 350),
(4, 'Boeing 737', 'N7001S', 175);

-- Insert sample flights (next month)
INSERT INTO flights (airline_id, aircraft_id, flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, base_price, status) VALUES
(1, 1, 'AA101', 1, 2, CURRENT_TIMESTAMP + INTERVAL '30 days 08:00', CURRENT_TIMESTAMP + INTERVAL '30 days 18:00', 450.00, 'SCHEDULED'),
(1, 1, 'AA102', 2, 1, CURRENT_TIMESTAMP + INTERVAL '30 days 09:00', CURRENT_TIMESTAMP + INTERVAL '30 days 17:00', 450.00, 'SCHEDULED'),
(2, 3, 'UA202', 1, 3, CURRENT_TIMESTAMP + INTERVAL '31 days 10:00', CURRENT_TIMESTAMP + INTERVAL '31 days 15:30', 380.00, 'SCHEDULED'),
(3, 5, 'DL303', 3, 4, CURRENT_TIMESTAMP + INTERVAL '32 days 07:00', CURRENT_TIMESTAMP + INTERVAL '32 days 10:30', 320.00, 'SCHEDULED'),
(4, 6, 'SW404', 5, 1, CURRENT_TIMESTAMP + INTERVAL '33 days 11:00', CURRENT_TIMESTAMP + INTERVAL '33 days 13:00', 280.00, 'SCHEDULED'),
(1, 2, 'AA505', 1, 7, CURRENT_TIMESTAMP + INTERVAL '35 days 23:00', CURRENT_TIMESTAMP + INTERVAL '36 days 11:00', 650.00, 'SCHEDULED');
