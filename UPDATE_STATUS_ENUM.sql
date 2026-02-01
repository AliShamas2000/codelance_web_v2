-- Run this SQL directly in your MySQL database to fix the appointments status enum
-- This will add 'accepted' and 'rejected' to the enum values

ALTER TABLE `appointments` 
MODIFY COLUMN `status` ENUM('pending', 'accepted', 'rejected', 'confirmed', 'completed', 'cancelled') 
DEFAULT 'pending';

