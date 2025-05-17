-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2025 at 06:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_web`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `question_id` int(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`id`, `question_id`, `content`, `user_id`, `created_at`) VALUES
(5, 5, 'Đây là câu trả lời cho câu hỏi 1.', 14, '2025-05-06 13:39:52'),
(6, 6, 'Đây là câu trả lời cho câu hỏi 2.', 13, '2025-05-06 13:39:52'),
(27, 10, 'Bạn có thể dùng PDO để kết nối bằng DSN, username và password.', 16, '2025-05-06 17:23:29'),
(28, 10, 'Dùng try-catch để kiểm soát lỗi khi kết nối.', 14, '2025-05-06 17:23:29'),
(29, 12, 'var có phạm vi function, let và const có phạm vi block.', 15, '2025-05-06 17:23:29'),
(30, 13, 'REST API là kiểu giao tiếp giữa client và server sử dụng HTTP.', 16, '2025-05-06 17:23:29'),
(31, 14, 'Flexbox sẽ tự động wrap nếu bạn đặt thuộc tính flex-wrap: wrap.', 14, '2025-05-06 17:23:29'),
(32, 10, 'useEffect nên dùng để lắng nghe thay đổi của props hoặc state.', 14, '2025-05-06 17:23:29'),
(33, 6, 'process.nextTick chạy trước bất kỳ I/O nào, setImmediate sau I/O.', 15, '2025-05-06 17:23:29'),
(35, 8, 'JWT lưu ở client, session lưu ở server.', 16, '2025-05-06 17:23:29'),
(36, 8, 'JWT có thể bị đánh cắp nếu lưu trong localStorage.', 15, '2025-05-06 17:23:29');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `image`) VALUES
(1, 'banner1.png'),
(2, 'banner2.png'),
(3, 'anhdep1.png');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `status` enum('pending','read','replied') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_faq` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `message`, `status`, `created_at`, `id_faq`) VALUES
(7, 'Kiểm tra đơn hàng', 'vana@gmail.com', 'Em mới mua đơn SON123, kiểm tra giúp em với ạ', 'replied', '2025-05-08 16:28:46', 5),
(8, 'Đổi hàng', 'vana@gmail.com', 'Em mua hàng ở địa chỉ Q10 hôm nay. Chiều mình mở cửa đến mấy giờ để em có thể qua đổi vậy ạ?', 'pending', '2025-05-08 16:35:49', NULL),
(9, 'Tư vấn size giày', 'tuannguyen@gmail.com', 'Chân em dài 26.5cm thì nên chọn size bao nhiêu ạ?', 'pending', '2025-05-08 16:45:12', 3),
(10, 'Kiểm tra khuyến mãi', 'linhhoang@yahoo.com', 'Shop còn áp dụng mã SALE20 cho đơn giày thể thao không ạ?', 'pending', '2025-05-08 16:47:39', 2),
(11, 'Hủy đơn hàng', 'minhpham@gmail.com', 'Em lỡ đặt nhầm size, shop hỗ trợ hủy đơn giúp em mã ORD459 được không ạ?', 'pending', '2025-05-08 16:50:23', NULL),
(12, 'Cần hóa đơn đỏ', 'lethu@outlook.com', 'Bên mình có xuất hóa đơn đỏ không ạ? Em cần cho đơn hàng mua công ty.', 'pending', '2025-05-08 16:52:11', NULL),
(13, 'Phản hồi chất lượng', 'dungnguyen@gmail.com', 'Giày vừa nhận hôm qua bị bong keo ở phần đế, shop hỗ trợ đổi giúp em với.', 'pending', '2025-05-08 16:55:30', 6);

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `answer` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `answer`, `created_at`) VALUES
(5, 'Dạ đơn gần được giao rồi ạ', '2025-05-08 16:32:10');

-- --------------------------------------------------------

--
-- Table structure for table `introduce_contents`
--

CREATE TABLE `introduce_contents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `introduce_contents`
--

INSERT INTO `introduce_contents` (`id`, `section`, `content`, `order_index`, `created_at`) VALUES
(1, 'intro', 'Chào mừng bạn đến với Cửa hàng của chúng tôi một cửa hàng 30 năm bán đồ giày dép balo', 1, '2025-05-06 09:14:37'),
(2, 'intro', 'Với sứ mệnh mang đến trải nghiệm mua sắm thuận tiện cho mọi người hehe cam on', 2, '2025-05-06 09:14:37'),
(3, 'commitment', 'Sản phẩm chính hãng, rõ ràng nguồn gốc.', 1, '2025-05-06 09:14:37'),
(4, 'commitment', 'Giá cả cạnh tranh và minh bạch.', 2, '2025-05-06 09:14:37'),
(5, 'commitment', 'Chính sách đổi trả linh hoạt trong 7 ngày', 3, '2025-05-06 09:14:37'),
(6, 'commitment', 'Miễn phí vận chuyển toàn quốc', 4, '2025-05-06 09:14:37'),
(8, 'thank', 'Chúng tôi rất mong nhận được sự ủng hộ rất nhiều', 1, '2025-05-06 09:14:37'),
(9, 'thank', 'Cảm ơn bạn đã ghé thăm và tin tưởng chúng tôi', 2, '2025-05-06 09:14:37'),
(11, 'thank', 'Xin cảm ơn mọi người đã mua hàng', 3, '2025-05-07 10:59:28'),
(14, 'intro', 'helllo đây là giới thiệu á nha', 11, '2025-05-07 12:06:20'),
(20, 'thank', 'heloooo', 12, '2025-05-07 12:38:26'),
(21, 'commitment', 'xin hua', 12, '2025-05-07 12:39:01'),
(22, 'thank', 'cam on', 11, '2025-05-07 12:39:19'),
(23, 'commitment', 'xin hua', 15, '2025-05-07 12:39:30');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('draft','pending','processing','completed','cancel') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `status`, `created_at`, `updated_at`) VALUES
(68, 14, 5030000.00, 'processing', '2025-05-08 15:53:56', '2025-05-08 15:54:10');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(178, 68, 2, 1, 3200000.00),
(179, 68, 4, 1, 1500000.00),
(180, 68, 27, 1, 330000.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `sold` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category` varchar(50) NOT NULL DEFAULT 'sneaker'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image`, `stock`, `sold`, `created_at`, `updated_at`, `category`) VALUES
(1, 'Nike Air Max 270 Women\'s Shoes Size 7 (Black)', 'Nike Air Max 270 dành cho nữ mang đến sự thoải mái suốt cả ngày với đệm Max Air 270 nổi bật. Thiết kế hiện đại kết hợp với chất liệu vải dệt nhẹ giúp đôi giày trở nên lý tưởng cho cả hoạt động thể thao và thời trang hàng ngày.', 4409000.00, '/src/public/uploads/1.png', 50, 10, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sneaker'),
(2, 'adidas Men\'s Ultraboost 21', 'adidas Ultraboost 21 mang đến trải nghiệm chạy bộ vượt trội với đệm Boost tăng 6% so với phiên bản trước, kết hợp với hệ thống LEP giúp tăng độ phản hồi và ổn định cho từng bước chạy.', 3200000.00, '/src/public/uploads/2.png', 59, 15, '2025-05-08 14:33:08', '2025-05-08 15:54:10', 'sneaker'),
(3, 'Puma RS-X Trophy Black', 'Puma RS-X Trophy Black kết hợp giữa phong cách retro và hiện đại, với thiết kế đậm chất thể thao và đế giày êm ái, mang lại sự thoải mái và nổi bật cho người mang.', 2700000.00, '/src/public/uploads/3.png', 40, 8, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sneaker'),
(4, 'Converse Chuck Taylor All Star Hi \'Black\'', 'Converse Chuck Taylor All Star Hi là biểu tượng thời trang vượt thời gian, với thiết kế cổ cao, màu đen cổ điển và chất liệu canvas bền bỉ, phù hợp cho mọi phong cách.', 1500000.00, '/src/public/uploads/4.png', 69, 20, '2025-05-08 14:33:08', '2025-05-08 15:54:10', 'sneaker'),
(5, 'Giày Sandal Nam Teva Original Universal', 'Teva Original Universal là đôi sandal nam cổ điển với thiết kế đơn giản, dây đeo chắc chắn và đế cao su bền bỉ, thích hợp cho các hoạt động ngoài trời và du lịch.', 475000.00, '/src/public/uploads/5.png', 80, 25, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sandal'),
(6, 'Arizona Birkenstock', 'Birkenstock Arizona là mẫu dép hai quai nổi tiếng với thiết kế đơn giản, đế giày hỗ trợ vòm chân và chất liệu cao cấp, mang lại sự thoải mái tối đa cho người sử dụng.', 2985802.00, '/src/public/uploads/6.png', 50, 12, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sandal'),
(7, 'Mens Crocs Classic Clog', 'Crocs Classic Clog dành cho nam với thiết kế nhẹ, thoáng khí và đế giày êm ái, phù hợp cho cả trong nhà và ngoài trời, mang lại sự tiện lợi và thoải mái suốt cả ngày.', 1595000.00, '/src/public/uploads/7.png', 90, 30, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sandal'),
(8, 'Herschel Backpack Little America', 'Herschel Little America là chiếc balo mang phong cách cổ điển với thiết kế hiện đại, ngăn chứa rộng rãi và đệm lưng thoải mái, lý tưởng cho việc học tập, làm việc hoặc du lịch.', 3115620.00, '/src/public/uploads/8.png', 35, 5, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'balo'),
(9, 'Fjällräven Kånken Backpack Navy', 'Fjällräven Kånken Navy là chiếc balo nổi tiếng của Thụy Điển với thiết kế vuông vắn, chất liệu Vinylon F chống nước và nhẹ, phù hợp cho học sinh, sinh viên và người đi làm.', 1894037.00, '/src/public/uploads/9.png', 45, 10, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'balo'),
(10, 'Anello Casual Bag', 'Anello Casual Bag là chiếc túi thời trang đến từ Nhật Bản với thiết kế đơn giản, nhiều ngăn tiện lợi và chất liệu bền đẹp, phù hợp cho cả nam và nữ trong các hoạt động hàng ngày.', 2019960.00, '/src/public/uploads/10.png', 60, 18, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'phukien'),
(11, 'Vans Old Skool Classic Black', 'Vans Old Skool là mẫu giày trượt ván biểu tượng với thiết kế sọc bên huyền thoại, chất liệu vải canvas kết hợp da lộn mang lại sự bền bỉ và phong cách năng động.', 1550000.00, '/src/public/uploads/11.png', 55, 12, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sneaker'),
(12, 'Nike Air Force 1 White', 'Nike Air Force 1 White với thiết kế tối giản, da thật cao cấp và đế giày Air cho cảm giác êm ái, phù hợp cho mọi hoạt động thường ngày.', 2700000.00, '/src/public/uploads/12.png', 60, 14, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sneaker'),
(13, 'MLB Big Ball Chunky Boston Red Sox', 'MLB Big Ball Chunky mang phong cách cá tính với thiết kế chunky và họa tiết đội bóng, là lựa chọn thời trang nổi bật.', 3200000.00, '/src/public/uploads/13.png', 35, 6, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sneaker'),
(14, 'Giày Sandal Vento Nam', 'Sandal Vento dành cho nam với đế EVA nhẹ, thiết kế dây dán tiện lợi và độ bám tốt, phù hợp cho đi học, đi chơi và dạo phố.', 380000.00, '/src/public/uploads/14.png', 90, 22, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sandal'),
(15, 'Columbia Sport Sandal', 'Columbia Sport Sandal được thiết kế cho hoạt động ngoài trời, với đế chống trượt và lớp lót nhanh khô, hỗ trợ tốt cho bàn chân.', 1450000.00, '/src/public/uploads/15.png', 75, 18, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sandal'),
(16, 'Samsonite Red Laptop Backpack', 'Samsonite Red là chiếc balo chuyên dụng cho laptop với ngăn đệm chống sốc, thiết kế thanh lịch và chất liệu chống nước cao cấp.', 2450000.00, '/src/public/uploads/16.png', 40, 8, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'balo'),
(17, 'Tucano Work Out 3 Backpack', 'Balo Tucano Work Out 3 thiết kế mỏng nhẹ, ngăn laptop 15.6”, chất liệu vải polyester cao cấp và nhiều ngăn tiện ích cho dân văn phòng.', 1850000.00, '/src/public/uploads/17.png', 45, 10, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'balo'),
(18, 'Uniqlo Shoulder Bag', 'Túi đeo vai Uniqlo đơn giản, gọn nhẹ và đa năng, chất liệu chống thấm nhẹ, phù hợp cho cả nam và nữ mang theo hàng ngày.', 550000.00, '/src/public/uploads/18.png', 100, 30, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'phukien'),
(19, 'Bellroy Tech Kit', 'Bellroy Tech Kit là túi đựng phụ kiện công nghệ với thiết kế tối giản, ngăn chia khoa học và chất liệu tái chế thân thiện với môi trường.', 1250000.00, '/src/public/uploads/19.png', 65, 15, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'phukien'),
(20, 'Túi Đeo Chéo Nam Mark Ryden', 'Túi đeo chéo Mark Ryden thiết kế thông minh, chống nước, khóa an toàn và cổng sạc USB tích hợp, lý tưởng cho người hay di chuyển.', 820000.00, '/src/public/uploads/20.png', 70, 20, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'phukien'),
(21, 'Sneaker Vans Old Skool Classic Black', 'Vans Old Skool với thiết kế sọc trắng biểu tượng, chất liệu vải canvas và da lộn, đế waffle bền bỉ giúp mang lại cảm giác thoải mái và phong cách cổ điển.', 1650000.00, '/src/public/uploads/21.png', 60, 10, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sneaker'),
(22, 'Sneaker New Balance 530 White Silver', 'New Balance 530 là sự kết hợp giữa phong cách retro và công nghệ hiện đại, thích hợp cho cả thể thao và thời trang thường ngày.', 2100000.00, '/src/public/uploads/22.png', 55, 8, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sneaker'),
(23, 'Giày Sandal Nữ Bita''s BMN51200', 'Sandal nữ BMN51200 đến từ thương hiệu Bita’s với kiểu dáng năng động, quai dán tiện lợi và đế êm ái phù hợp cho di chuyển hàng ngày.', 395000.00, '/src/public/uploads/23.png', 70, 20, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sandal'),
(24, 'Giày Sandal Thể Thao Rider RX', 'Rider RX với thiết kế thể thao, chất liệu cao su chống trượt và đế đệm mềm, lý tưởng cho các hoạt động ngoài trời.', 520000.00, '/src/public/uploads/24.png', 85, 18, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'sandal'),
(25, 'Balo SimpleCarry K5', 'Balo SimpleCarry K5 thiết kế đơn giản, ngăn chứa laptop riêng biệt, phù hợp cho học sinh, sinh viên và dân văn phòng.', 690000.00, '/src/public/uploads/25.png', 45, 7, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'balo'),
(26, 'Balo Adidas Classic Badge Of Sport', 'Balo Adidas với logo đặc trưng, chất liệu polyester bền và chống nước nhẹ, có nhiều ngăn tiện lợi cho sinh hoạt hàng ngày.', 820000.00, '/src/public/uploads/26.png', 40, 6, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'balo'),
(27, 'Phụ kiện Túi Đeo Chéo Nam Thể Thao', 'Túi đeo chéo nam phong cách thể thao, nhiều ngăn nhỏ tiện lợi, phù hợp đi chơi hoặc tập gym.', 330000.00, '/src/public/uploads/27.png', 89, 25, '2025-05-08 14:33:08', '2025-05-08 15:54:10', 'phukien'),
(28, 'Phụ kiện Mũ Lưỡi Trai MLB NY', 'Mũ lưỡi trai MLB NY chính hãng, thiết kế thời trang với logo nổi, chất vải thoáng khí phù hợp mùa hè.', 550000.00, '/src/public/uploads/28.png', 75, 18, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'phukien'),
(29, 'Phụ kiện Vớ Uniqlo Cotton Set 3 Đôi', 'Bộ 3 đôi vớ Uniqlo chất liệu cotton co giãn, thấm hút tốt, thích hợp đi giày sneaker hàng ngày.', 190000.00, '/src/public/uploads/29.png', 120, 30, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'phukien'),
(30, 'Phụ kiện Túi Đeo Vai Mini Hàn Quốc', 'Túi đeo mini phong cách Hàn Quốc với thiết kế nhỏ gọn, phù hợp cho nữ mang điện thoại, ví và các vật dụng cá nhân.', 410000.00, '/src/public/uploads/30.png', 65, 12, '2025-05-08 14:33:08', '2025-05-08 14:33:08', 'phukien');

-- --------------------------------------------------------

--
-- Table structure for table `shop_address`
--

CREATE TABLE `shop_address` (
  `id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `shop_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop_address`
--

INSERT INTO `shop_address` (`id`, `address`, `shop_id`) VALUES
(6, '268 Lý Thường Kiệt, Phường 14, Quận 10 , Thành phố Hồ Chí Minh , Việt Nam', 1),
(7, 'Khu đô thị Đại học Quốc gia Thành phố Hồ Chí Minh, Phường Đông Hòa, Thành phố Dĩ An, Bình Dương.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `shop_info`
--

CREATE TABLE `shop_info` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop_info`
--

INSERT INTO `shop_info` (`id`, `name`, `description`, `logo`, `email`, `phone`) VALUES
(1, 'Công ty Shoes VietNam', 'Công ty chuyên sản xuất và phân phối giày dép chất lượng cao với hơn 10 năm kinh nghiệm trong ngành. Chúng tôi cam kết mang đến những sản phẩm thoải mái, bền đẹp với giá cả hợp lý...', '/src/public/uploads/681cd32115763-logoo.png', 'support@shoes.com', '0901234567');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone` varchar(10) NOT NULL,
  `address` varchar(255) NOT NULL,
  `role` int(11) NOT NULL DEFAULT 2,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `token` varchar(64) DEFAULT NULL,
  `token_expire` date DEFAULT current_timestamp(),
  `gender` enum('male','female') NOT NULL DEFAULT 'male'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `avatar`, `dob`, `created_at`, `phone`, `address`, `role`, `updated_at`, `token`, `token_expire`, `gender`) VALUES
(1, 'Nguyễn Thị Như Thuỳ', 'tuanviepborocute1@gmail.com', '$2y$10$5g/p1KtPEkBazoVm/D1G6uLTy33kW3yw3RNiKeQefqqyoI9NFeY.W', '681ba0c9952f2-default.png', '2025-01-08', '2025-05-06 11:06:29', '1234567899', 'khu phố 3 hoà vinh đông hoà phú yên', 2, '2025-05-07 18:53:27', NULL, '2025-05-06', 'female'),
(13, 'Phan Ngọc Hòa', 'hoa@gmail.com', '$2y$10$nqp47gDcnpGoMJZrZuvb6uwmsPcaCVMVMfys03DQl60ncKi3CaV3.', 'default.png', '2004-01-10', '2025-05-08 15:47:34', '0336687448', '523 Do Xuan Hop', 1, '2025-05-08 16:32:10', NULL, '2025-05-08', ''),
(14, 'Nguyen Van Chi', 'vana@gmail.com', '$2y$10$6PVqh8RTidrZeWnbp996jujGMUGLfDzBGWTtEfOP6eu6/V6C4ZsCK', '/src/public/uploads/681cd3c35cca2-freeship.png', '2004-01-10', '2025-05-08 15:53:25', '0887744559', 'Ha Noi, Viet Nam', 2, '2025-05-08 15:54:43', NULL, '2025-05-08', ''),
(15, 'Ha Hiep', 'ha@gmail.com', '$2y$10$6PVqh8RTidrZeWnbp996jujGMUGLfDzBGWTtEfOP6eu6/V6C4ZsCK', '/src/public/uploads/681ba0c9952f2-default.png', '2004-01-12', '2025-05-08 15:53:25', '0887744559', 'Ha Nam, Viet Nam', 2, '2025-05-08 15:54:43', NULL, '2025-05-08', ''),
(16, 'Vo Chi Hoang', 'hoangvo@gmail.com', '$2y$10$6PVqh8RTidrZeWnbp996jujGMUGLfDzBGWTtEfOP6eu6/V6C4ZsCK', '/src/public/uploads/681ba0c9952f2-default.png', '2004-01-10', '2025-05-08 15:53:25', '0887744559', 'Ho Chi Minh, Viet Nam', 2, '2025-05-08 15:54:43', NULL, '2025-05-08', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `news_id` (`news_id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_answer_contact` (`id_faq`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `introduce_contents`
--
ALTER TABLE `introduce_contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_product` (`order_id`,`product_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `introduce_contents`
--
ALTER TABLE `introduce_contents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
