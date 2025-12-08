-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Dec 08. 08:39
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `2025_szallasfoglalo`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `accommodations`
--

CREATE TABLE `accommodations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `address` varchar(150) NOT NULL,
  `capacity` int(20) NOT NULL,
  `basePrice` int(20) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `accommodations`
--

INSERT INTO `accommodations` (`id`, `name`, `description`, `address`, `capacity`, `basePrice`, `active`, `createdAt`) VALUES
(1, 'ex', 'Hic vel tempora autem sed. Voluptates molestiae ipsum eius architecto.', '0536 Fábián, Albert határsor 891', 0, 431004555, 0, '2004-09-17 00:11:58'),
(2, 'et', 'Sunt et rerum voluptatem quia provident voluptatum et tenetur. Sapiente eaque labore doloremque sint ipsam sed et. Molestiae labore iste omnis et eos.', '4979 Jakab, Szőke lakótelep 049', 0, 0, 1, '1991-10-22 19:37:25'),
(3, 'perferendis', 'Fugiat qui id et quos sit quo consequuntur sed. Aliquid sed veritatis cumque sit. Numquam temporibus et ipsum pariatur iste possimus. Ea dolor distinctio quasi eaque.', '4327 Jenő, Bettina körút 221', 0, 71237, 0, '1996-09-30 12:55:18'),
(4, 'necessitatibus', 'Quia velit aut molestias dolor facere. Aspernatur ut ut ut necessitatibus sit. Quae eaque iste recusandae aliquid totam. Sint quasi neque nulla et.', '6990 Gabriella, Bendegúz fasor 43750', 0, 48455603, 0, '1979-05-26 02:15:19'),
(5, 'occaecati', 'Eligendi voluptatem laboriosam est officiis saepe. Aut officiis id qui et et. Quaerat sit aut quis et.', '4464 Veres, Váradi mélyút 08 42. emelet', 0, 0, 1, '1981-06-13 00:48:07'),
(6, 'qui', 'Dolores quibusdam dignissimos dolorem eos consectetur voluptatum. Dolores hic consequatur ut ab. Vel eos aspernatur eum eius.', '4520 Albert, Oláh árok 5422 55. ajtó', 0, 0, 0, '2020-06-20 21:55:43'),
(7, 'incidunt', 'Non animi repellat voluptatem in. Sed harum quia molestiae autem non. Laborum harum dolores velit quae sequi nisi. Labore pariatur autem eveniet eveniet eveniet voluptatem.', '3501 Pásztor, Gitta út 7185', 0, 1819, 1, '1984-02-06 22:35:00'),
(8, 'quod', 'Ipsum rem a nostrum iste odit nam. Nostrum suscipit totam consectetur ipsam corporis. Nulla ut dolor aut debitis ullam amet. Quos impedit nam suscipit deleniti et autem molestias aut.', '3314 Varga, Gulyás lejáró 95 06. ajtó', 0, 111613725, 1, '2023-08-23 05:40:23'),
(9, 'praesentium', 'Modi laborum aut dolores aut minima sunt. Reiciendis adipisci repudiandae enim commodi aut.', '9003 Endre, Hunor forduló 3294', 0, 125, 0, '1991-08-10 23:33:57'),
(10, 'modi', 'Reprehenderit quia exercitationem et in consequuntur magni. Corrupti suscipit libero quo optio quia beatae voluptatibus. Laboriosam dolor qui repudiandae iste.', '2717 Kerekes, Henriett határsor 162 27. emelet', 0, 7, 0, '2008-10-11 04:51:35'),
(11, 'beatae', 'Similique vel quia facere alias. Quis aut sequi omnis ab nulla sunt ut.', '5506 Boróka, Biró pincesor 86', 0, 2, 0, '1971-12-13 03:56:13'),
(12, 'ea', 'Dolores minus soluta quasi doloribus deleniti molestias. Reprehenderit nihil dicta est quos itaque nam qui. Placeat id accusantium dolorem expedita. Vel veritatis vel voluptatem amet.', '5165 Vincze, Fábián park 88', 0, 915, 0, '2021-02-15 17:16:13'),
(13, 'necessitatibus', 'Molestiae quis cum voluptatum atque. Provident magnam repellendus totam non. Nesciunt praesentium quis voluptas voluptas praesentium.', '9503 Papp, Milán lejáró 631 14. emelet', 0, 19224, 1, '1998-08-15 09:40:35'),
(14, 'velit', 'Beatae unde ex at quas eligendi ut eum minima. Velit aut cum quas occaecati doloribus sit eum. Eligendi quia beatae eaque labore minus facere. Dolorum impedit beatae fuga voluptatibus non id.', '3570 Szilágyi, Kincső orom 30', 0, 1126, 1, '2020-02-08 08:48:09'),
(15, 'est', 'Optio molestiae quod voluptas laborum assumenda magnam et. Neque voluptas sunt sint at qui eaque delectus. Quia enim corporis facere deserunt omnis nihil. Et corrupti inventore enim qui ut.', '6162 Barna, Patrik lejáró 378 79. emelet', 0, 0, 0, '2005-11-28 05:20:46'),
(16, 'iusto', 'Corporis perferendis autem et excepturi. Voluptas non vel omnis. Ea sint vero cumque dolorem aliquid voluptatem cumque vel. Odit deleniti earum error amet.', '7479 Halász, Varga kert 4262 57. ajtó', 0, 28321483, 1, '1982-06-14 17:21:00'),
(17, 'a', 'Nostrum nostrum consequatur distinctio est corporis doloribus autem. Ab eos aut saepe quae consequuntur explicabo. Ut quam rem occaecati nesciunt. Sapiente autem cum adipisci ut laudantium molestias.', '8960 Lakatos, Evelin körtér 20441', 0, 1340, 1, '1990-01-11 05:29:13'),
(18, 'nemo', 'Quo mollitia qui et et repellendus enim totam. Repellat pariatur natus delectus omnis. Et sit eos voluptates at est.', '4786 Gréta, Georgina pincesor 8917', 0, 10799, 0, '2020-04-25 00:42:22'),
(19, 'beatae', 'Repellendus enim quae aperiam sunt. Velit quo expedita minima impedit tempora nulla officia. Laudantium optio optio eum sed itaque impedit. Soluta officiis et qui impedit.', '9908 Lukács, Liliána orom 94', 0, 7, 1, '1985-02-23 02:45:10'),
(20, 'impedit', 'Eaque delectus cumque ut similique sit. Ad animi itaque suscipit. Est aut veritatis animi expedita aut. Voluptates sit delectus voluptate recusandae autem.', '1563 Alexa, Hegedűs udvar 795', 0, 142015, 0, '2024-12-20 09:56:07'),
(21, 'sint', 'Nesciunt aliquid sed nemo facere. Ex voluptates eum qui numquam. Suscipit ut fuga voluptatum voluptatum reiciendis.', '0087 Váradi, Géza orom 52', 0, 51, 0, '1971-09-25 19:00:29'),
(22, 'maxime', 'Natus et iste facilis eligendi at. A ex enim vel libero corporis sunt. Optio qui officiis sapiente cupiditate.', '1037 Vince, Árpád sétány 49', 0, 14, 0, '2009-10-21 00:12:02'),
(23, 'itaque', 'Quod repudiandae repellat vel officiis ullam quisquam facilis. Et eligendi veniam voluptatibus omnis voluptatibus alias. Quaerat at repudiandae quia provident ratione tempore. Et libero corporis quam.', '9249 Marcell, Richárd ösvény 70', 0, 2, 1, '1976-03-16 05:06:26'),
(24, 'molestias', 'Occaecati magni earum corporis dolores qui enim. Ut et voluptatem porro odio. Porro natus asperiores voluptatibus dolorem et voluptatum perspiciatis. Numquam consectetur fuga asperiores amet iusto.', '6695 Lakatos, Valéria sétány 6143', 0, 0, 1, '1983-12-28 03:00:58'),
(25, 'iusto', 'Ducimus eveniet et aspernatur porro quaerat corporis eos. Totam fuga facere aliquid qui provident. Officia id quo ab magni praesentium et consectetur velit. Provident occaecati et voluptate voluptate et voluptates. Nobis quam magni sint molestiae.', '2173 Major, Király part 072', 0, 0, 1, '2014-05-28 09:59:45'),
(26, 'dignissimos', 'Velit non autem nostrum sapiente. Sunt rerum hic enim. Quas temporibus architecto soluta libero alias repellendus.', '6560 Szilágyi, Lukács körönd 14', 0, 79568875, 0, '1999-09-18 00:46:29'),
(27, 'omnis', 'Aut eaque commodi odit cupiditate delectus praesentium facilis. A tempora facere voluptatem. Possimus error sit sit quasi vero.', '8275 Bálint, Barna üdülőpart 8234 91. emelet', 0, 19588733, 0, '2023-06-03 02:05:47'),
(28, 'incidunt', 'Recusandae nihil et consequatur mollitia alias sed. Est sit delectus ducimus. Voluptatibus sit porro ea esse.', '4024 Pataki, Szekeres lépcső 84151 10. ajtó', 0, 39846197, 0, '1985-04-08 00:55:57'),
(29, 'non', 'Possimus sequi autem veritatis reprehenderit inventore consequuntur. Voluptates dignissimos quaerat perspiciatis quod et est eum. Ducimus recusandae commodi vero accusantium qui quasi.', '6079 Fekete, Mészáros mélyút 055 64. emelet', 0, 0, 0, '2025-08-19 19:15:36'),
(30, 'quis', 'Autem ut sed qui non voluptas harum voluptatem. Molestias sint dolore laudantium consequatur rem. Corporis a aperiam sed libero.', '6404 Székely, Géza lejáró 60 78. ajtó', 0, 819, 0, '2019-02-10 02:38:53'),
(31, 'rerum', 'Nobis labore aliquid expedita et laborum ut. Aut et voluptatem placeat porro. Atque earum ut vero eius est voluptas fugiat. Necessitatibus unde quasi et libero laboriosam consequatur.', '5488 Váradi, Lakatos sétaút 77287', 0, 2499, 1, '1986-08-17 19:20:03'),
(32, 'minima', 'Quidem debitis ipsum nam placeat atque quidem. Quasi sed est qui aliquid. Eligendi atque et illum cumque et numquam veniam.', '3263 Molnár, Botond tere 17 18. ajtó', 0, 203068148, 1, '2024-06-14 04:49:31'),
(33, 'pariatur', 'Unde minima et voluptas eaque dolor alias reiciendis et. Vel dolores aut maxime similique eum in aspernatur. Sint eligendi quaerat voluptatem blanditiis dolore. Autem at eveniet dolorum ut.', '4908 Fehér, Kiss út 69 48. emelet', 0, 29, 1, '1978-02-01 13:33:23'),
(34, 'maxime', 'Omnis modi veniam ratione at facilis molestias. Fugit nemo rem voluptatibus. Modi maxime in aut ab facere sapiente. Aut vel ut voluptatem optio sunt similique.', '5961 Alexa, Klaudia pincesor 278', 0, 0, 1, '1993-02-18 13:23:17'),
(35, 'reiciendis', 'Itaque nam molestiae et voluptas optio aut excepturi labore. Aperiam ipsa unde quam sed vero. Porro sint et minima beatae quaerat veniam.', '2813 Szőke, Bodnár erdősor 32 40. ajtó', 0, 0, 0, '1978-07-11 01:25:02'),
(36, 'rem', 'Rerum et magni perferendis nemo maxime. Ipsum sequi voluptatibus enim iusto et dignissimos nulla. Deserunt atque consequatur vel eum explicabo consequatur. Dolorem beatae sed voluptas. Illo et a placeat dicta voluptatem dolor officiis.', '5687 Tamás, Endre pincesor 339', 0, 0, 1, '2020-08-09 02:45:50'),
(37, 'non', 'Omnis aut omnis et rerum quae dolor omnis. Fuga sed quis eum voluptatem autem et dolores. Eius quia similique voluptatibus aut ipsum ullam fugit.', '9468 Szőke, Kozma átjáró 99', 0, 5785390, 0, '2022-08-08 17:42:19'),
(38, 'tenetur', 'Ea qui ducimus reiciendis qui doloremque. Ipsum molestiae assumenda in magnam magni qui. Molestiae et blanditiis laboriosam rerum enim.', '3211 Csenge, Farkas útja 4528 39. ajtó', 0, 89, 0, '2018-08-10 20:09:12'),
(39, 'necessitatibus', 'Exercitationem eum ipsum ut eaque. Eum ex veritatis asperiores et non. Inventore cupiditate sed et vel ab at.', '9096 Liliána, Sándor híd 936 63. emelet', 0, 0, 0, '1984-05-07 05:54:05'),
(40, 'rerum', 'Deleniti placeat quia quod aliquam exercitationem excepturi recusandae et. Libero sit vel quia voluptas. Dolorem omnis nihil et assumenda.', '9688 Illés, Ernő sétány 957', 0, 33112, 1, '2012-04-30 03:21:11'),
(41, 'dolores', 'Qui in voluptas illo voluptatibus sunt a ullam. Iste sint rerum deserunt neque. Possimus voluptas incidunt dolorem.', '6673 Juhász, Vass forduló 85353', 0, 415231687, 1, '2019-07-25 04:38:10'),
(42, 'sit', 'Dolor eum et laborum molestias animi. Animi cumque ad libero omnis. Vel sed quibusdam temporibus modi quam vel. Dolores totam quasi ut delectus ipsa rerum quo.', '7575 Gáspár, Dorina sétány 44', 0, 6707027, 0, '1985-02-22 06:28:02'),
(43, 'asperiores', 'Voluptatibus explicabo quasi dignissimos accusantium libero corrupti. Expedita et iusto expedita recusandae eligendi explicabo autem.', '5791 Barnabás, Pap udvar 13', 0, 48623, 1, '2018-03-31 01:00:19'),
(44, 'consequatur', 'Illo eos error nihil. Id quod in facilis fugiat facere maxime amet labore. Fugit molestias quia temporibus qui consequatur.', '3460 Somogyi, Orosz fasor 10828 79. ajtó', 0, 31, 0, '1992-01-21 10:54:55'),
(45, 'accusamus', 'Illum rerum amet et ut. Sed asperiores fugit id dolorum nulla quibusdam est. Est et cupiditate quae voluptatem. Tenetur consequatur nihil sed sint error voluptas laudantium.', '9150 Szalai, Bognár határsor 02', 0, 19707, 1, '1994-07-18 21:45:05'),
(46, 'et', 'Est tenetur suscipit sit nihil dolorum. Ut dignissimos corporis sint assumenda magnam et. Sed earum qui dolor fugit beatae est rerum et. Asperiores consequatur similique quis consequatur.', '0943 Oláh, Zsolt lakótelep 38 33. ajtó', 0, 151, 0, '1974-06-09 08:31:04'),
(47, 'facilis', 'Nulla dicta ipsam aut. Incidunt quam quaerat magnam distinctio itaque magnam corrupti. Animi repellat magni et non temporibus ipsam. Est sed at assumenda laborum eaque ducimus.', '2550 Fehér, Orsós játszótér 67 00. ajtó', 0, 28534504, 1, '1974-07-12 11:46:07'),
(48, 'ut', 'Voluptatem maxime vel vitae corporis consequatur in voluptate. Enim ea dolorem laudantium non aspernatur aut. Temporibus ut ipsa ea aut et at suscipit.', '1175 Olívia, Hegedüs lépcső 37156 60. ajtó', 0, 0, 1, '2010-04-01 09:01:43'),
(49, 'placeat', 'Quas sunt et deserunt amet ea aut. Expedita sunt ullam sed earum provident. Et iure ducimus et placeat temporibus quia. Sint quaerat recusandae repudiandae repudiandae eum non qui. Officia at nobis soluta non nisi expedita et.', '7006 Gréta, Szűcs forduló 32882', 0, 406, 0, '2008-04-23 17:29:48'),
(50, 'ea', 'Doloremque qui maiores temporibus laudantium ut aliquam dolorem ad. Dignissimos voluptatibus cumque repellat nihil occaecati qui ad. Facilis libero eligendi id non quidem alias est. Incidunt et velit neque molestiae ut iure.', '3542 Ármin, Pap fasor 44', 0, 2, 0, '2003-02-17 12:41:13');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `accommodation_images`
--

CREATE TABLE `accommodation_images` (
  `id` int(11) NOT NULL,
  `accommodationId` int(11) NOT NULL,
  `imagePath` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `accommodationId` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `persons` int(10) NOT NULL,
  `totalPrice` int(20) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(40) NOT NULL,
  `role` varchar(40) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`) VALUES
(1, 'reiciendis', 'bakos.jenő@example.net', 'fb079332fbda4ff8dc655740bb2c3bcd640011f3', '', '2000-12-03 22:13:49'),
(2, 'numquam', 'ejakab@example.org', '8e9978fcbf36a028e0a1eb4df2e3628d57120bba', '', '2013-04-05 02:51:37'),
(3, 'consequatur', 'ramóna64@example.net', '3939aab51b38ab2d612b26124bd5831ff0535a0f', '', '2001-10-31 02:57:27'),
(4, 'quia', 'zsombor80@example.net', '61126e6f80db3e60642c042d82ae9b1b52ee2e27', '', '2009-04-20 16:27:26'),
(5, 'aut', 'richárd.sipos@example.org', '56e304619d9552e1bbe5694a30d09f648e058b17', '', '2000-09-06 15:22:47'),
(6, 'quaerat', 'lbálint@example.com', '583ce940495d98fba9e095ff060be8343613ab5f', '', '1989-10-08 14:15:38'),
(7, 'dolorem', 'rlukács@example.net', '16644aa5baeedd4aecaa64a03bb776631e621418', '', '1995-05-23 23:32:47'),
(8, 'inventore', 'kerekes.maja@example.org', 'b208716541df68eaa690dbd6f83b224898b09476', '', '1999-12-08 14:37:22'),
(9, 'praesentium', 'nemes.antal@example.com', '3117dfce274f0cecb2ced4af89ded60e7655a3ef', '', '1997-04-28 11:02:35'),
(10, 'maxime', 'török.zsóka@example.net', 'd447e17ef700e9fcf121a7ef1e282520defaa50c', '', '2000-08-29 05:56:48'),
(11, 'ducimus', 'andrea76@example.net', 'ffe0ea03f2af80eb1b44ec8da90f47f35c662df8', '', '1979-03-21 06:14:28'),
(12, 'et', 'boróka.kocsis@example.org', 'fe65036161ae65a56be71bfbab387f6450bfd8b7', '', '1971-09-24 11:16:23'),
(13, 'sit', 'gál.gabriella@example.net', 'b8baeba60c15eeb234c9753bfb5803e7a6bc49d7', '', '2010-04-01 15:38:41'),
(14, 'voluptatibus', 'balogh.léna@example.net', 'abce8b19eeff164d37b4a049fda01d5fce2d8dd6', '', '1992-01-16 07:50:29'),
(15, 'qui', 'mmáté@example.org', 'cbd3ed75821d8011f58b9306f25b5e83481c9abf', '', '2019-12-01 21:00:06'),
(16, 'voluptatibus', 'jános.pataki@example.org', '0bf8ebee6d054bcd8beee1a81c0ae08d1b96692d', '', '2002-02-06 01:36:05'),
(17, 'fugiat', 'takács.zsóka@example.com', '2c7600ea008b3779bf541edc19bc4ea3b2fc6d8d', '', '1991-01-01 10:57:47'),
(18, 'architecto', 'isimon@example.org', 'bb8759f685123730db93d649b2e7b7ba26589f64', '', '1994-09-21 12:20:25'),
(19, 'et', 'vsipos@example.com', '979317a579b4f33ad617534edbf17f2288ba24fa', '', '2015-10-12 16:25:12'),
(20, 'sequi', 'milla.péter@example.org', '8a82bcdfa19705472bfc37f85ddbd74508f92043', '', '1978-11-09 21:38:15'),
(21, 'nihil', 'mfekete@example.net', '5c143a044f2c57ec19f3b2f3d66e5bf6a358f6fc', '', '1971-04-18 21:05:47'),
(22, 'eos', 'dhegedűs@example.com', '78a4c0f6a92d6355d642e46b13e98be73f0a0977', '', '2013-06-14 16:29:56'),
(23, 'iusto', 'péter71@example.com', 'bba039f2cf47b9d754cae36e39aaa7ff92c0bb13', '', '1986-11-20 11:36:57'),
(24, 'quis', 'lászló98@example.org', '2d3d871bb5477643f7d4f37126cb02e308c39157', '', '2003-12-25 18:07:04'),
(25, 'quia', 'váradi.liliána@example.org', '63a1971bcf91bab01f3c47de258c551dd195d101', '', '1985-06-13 15:31:58'),
(26, 'deserunt', 'péter.marcell@example.com', 'efd7704a9299f2105aab31f36b46e46de4be4faa', '', '1973-01-08 03:18:51'),
(27, 'nulla', 'rborbély@example.net', 'bcc49c6421ff14262e8f9d8ddc85f9d51f2a113c', '', '1994-07-15 01:12:02'),
(28, 'autem', 'kis.míra@example.com', '03a07d61b9c8abb1336786775706b6a7553469b1', '', '2013-02-14 10:19:47'),
(29, 'odio', 'ádám.németh@example.net', 'fe85c01ad7c50fe991372e231187e0d669d1e375', '', '2014-10-02 11:05:15'),
(30, 'voluptas', 'kristóf.horváth@example.com', '60db96d7a9f31d24db91926b511fd3b4d50d9e33', '', '2004-02-04 14:58:31'),
(31, 'qui', 'gabriella.váradi@example.net', 'b3362e64576dde074380a20e52ee50746ab0a5f0', '', '1982-12-20 06:30:16'),
(32, 'at', 'ernő45@example.org', '1999ca39bea618f5097168494a30d22fd9b44bd3', '', '2003-02-02 19:34:50'),
(33, 'temporibus', 'qdeák@example.com', '14d1650eedf2412c20c95e7f1ed1387251c265c8', '', '1975-01-30 17:37:02'),
(34, 'voluptas', 'bognár.ramóna@example.com', '4c236e228ca90c72ab8454ee8df244741e3d545b', '', '2005-07-02 10:59:30'),
(35, 'recusandae', 'hunor72@example.com', 'fe9c8cd7d1fd1653fa99280e8337460a7559cc85', '', '2013-01-17 20:02:41'),
(36, 'recusandae', 'bfodor@example.com', '03507c92b8623217aaebade60b86a1027e0a6111', '', '1990-11-01 19:35:44'),
(37, 'repellendus', 'zfarkas@example.org', 'f598b6f22bcc7eecc15fdd2c5965739834cbc6e0', '', '1977-09-17 07:57:17'),
(38, 'et', 'dorottya16@example.net', '5c1f5996b880fc6415bbe0cc1ec9d2aee192bcde', '', '2024-08-26 02:41:21'),
(39, 'aperiam', 'somogyi.szervác@example.net', 'e29f5b80504bfc517a2848088572ab7b0fc94cb3', '', '1978-05-21 00:04:24'),
(40, 'et', 'noel.balogh@example.org', 'c739c7d6a6aefefe2dcb3a21c466d3bdce8cebbc', '', '1992-08-03 04:08:00'),
(41, 'impedit', 'horsós@example.net', '9ccfdaaa56756e09c59e558074d532a4e3b514ff', '', '1975-10-19 14:51:43'),
(42, 'quia', 'olivér77@example.org', '4abc93c8f43541e4c420209191566349f499d59f', '', '1974-05-15 00:08:35'),
(43, 'iure', 'lváradi@example.net', '576700af1c262179b2d213dde2367cb65fe69464', '', '1970-12-07 16:41:51'),
(44, 'voluptatem', 'lengyel.liza@example.org', '13ff709061efb6ee4416926e2d3200ef778e1462', '', '2010-02-11 10:25:50'),
(45, 'nesciunt', 'attila.bodnár@example.net', 'd0e6f3420cdace298c63cce3d574fca92317c5f6', '', '1999-03-27 05:18:45'),
(46, 'inventore', 'mátyás23@example.com', '6d16be6460e837e966687c8031ec5d04d20fc3c0', '', '1972-12-12 19:11:13'),
(47, 'distinctio', 'orosz.katinka@example.net', 'fa873dba68be3e2a4ee0f76207b5295929234ab0', '', '1981-04-18 11:23:58'),
(48, 'eaque', 'fhajdu@example.org', 'cdc42a5b1220afc500d0dd01eb65bb2ce654f5e9', '', '1975-04-18 06:59:23'),
(49, 'sapiente', 'valéria.faragó@example.net', '05fb6404ab0d52d51c9a406bcdd3be4aba88f450', '', '2022-08-16 07:29:13'),
(50, 'fugiat', 'kristóf73@example.net', '4c21720dcdd42a657d7a35fec295c90b9053d9d8', '', '1976-04-08 23:13:48');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `accommodations`
--
ALTER TABLE `accommodations`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `accommodation_images`
--
ALTER TABLE `accommodation_images`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `accommodations`
--
ALTER TABLE `accommodations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT a táblához `accommodation_images`
--
ALTER TABLE `accommodation_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
