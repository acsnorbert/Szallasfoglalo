-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Dec 09. 12:06
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
  `shortDescription` text DEFAULT NULL,
  `longDescription` text DEFAULT NULL,
  `address` varchar(150) NOT NULL,
  `maxCapacity` int(20) NOT NULL,
  `basePrice` int(20) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `accommodations`
--

INSERT INTO `accommodations` (`id`, `name`, `description`, `shortDescription`, `longDescription`, `address`, `maxCapacity`, `basePrice`, `isActive`, `createdAt`) VALUES
(1, 'Balatoni Panoráma Apartman', 'Modern, légkondicionált apartman lélegzetelállító Balaton-ra néző kilátással', 'Modern apartman csodálatos Balaton panorámával, 50 méterre a strandtól.', 'Ez a gyönyörű, 65 négyzetméteres apartman a Balaton partján található, mindössze 50 méterre a strandtól. A teljesen felszerelt apartman légkondicionált, wifi-vel rendelkezik, és egy nagy teraszon keresztül lélegzetelállító kilátást nyújt a tóra. Ideális választás pároknak és családoknak egyaránt. A közeli étteremek, kávézók és programok könnyedén elérhetők.', 'Balatonfüred, Vitorlás utca 12.', 4, 25000, 1, '2025-12-09 10:18:01'),
(2, 'Budai Várós Stúdió', 'Elegáns stúdió apartman a Budai Várban', 'Hangulatos stúdió a történelmi Budai Várban, tökéletes helyen.', 'A Budai Vár szívében található ez a bájos, 35 négyzetméteres stúdió apartman. Tökéletes választás azok számára, akik a történelmi Budapest atmoszféráját szeretnék felfedezni. A Halászbástya és a Mátyás templom néhány perces sétára található. Modern berendezés, wifi, teljes konyha. Csendes, nyugodt környezet a város zajától távol.', 'Budapest, Fő utca 34.', 2, 18000, 1, '2025-12-09 10:18:01'),
(3, 'Hévízi Wellness Villa', 'Luxus villa saját jacuzzival', 'Exkluzív villa privát wellness résszel, Hévíz gyógyfürdőjétől 5 percre.', 'Fedezze fel ezt a lenyűgöző, 120 négyzetméteres villát Hévízen! A ház 3 hálószobával, 2 fürdőszobával, teljes felszereltségű konyhával és tágas nappalival rendelkezik. A különlegesség a fedett terasz jakuzzival és szaunával. A híres Hévízi-tó és gyógyfürdő mindössze 5 perc sétára található. Tökéletes választás családoknak vagy baráti társaságoknak, akik kikapcsolódást és wellness élményt keresnek.', 'Hévíz, Termál köz 8.', 6, 45000, 1, '2025-12-09 10:18:01'),
(4, 'Tokaji Borvidéki Vendégház', 'Autentikus vendégház a világhírű borvidéken', 'Hagyományos magyar vendégház pincével, a Tokaji borvidék szívében.', 'Ez a bájosan felújított, 80 négyzetméteres vendégház a Tokaji borvidéken található, ahol a világhírű aszúbort készítik. A ház 2 hálószobával, nappalival, konyhával és saját borospincével rendelkezik. Ideális kiindulópont bortúrákhoz és a történelmi Tokaj felfedezéséhez. A kertből csodálatos kilátás nyílik a szőlőültetvényekre és a Tisza folyóra.', 'Tokaj, Rákóczi utca 67.', 5, 22000, 1, '2025-12-09 10:18:01'),
(5, 'Egerszalóki Termál Ház', 'Családi ház termálfürdő közelében', 'Tágas családi ház közvetlen közelében a híres sódombhoz.', 'Tágas, 100 négyzetméteres családi ház Egerszalókon, a híres termálfürdőtől és sódombokhoz 300 méterre. 3 hálószoba, 2 fürdőszoba, nagy konyha-étkező, nappali kandallóval. Gondozott kert grillezési lehetőséggel. Eger történelmi városa 10 km-re található. Tökéletes választás gyermekes családoknak és nyugdíjas csoportoknak.', 'Egerszalók, Petőfi utca 23.', 7, 28000, 1, '2025-12-09 10:18:01');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `accommodation_images`
--

CREATE TABLE `accommodation_images` (
  `id` int(11) NOT NULL,
  `accommodationId` int(11) NOT NULL,
  `imagePath` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `accommodation_images`
--

INSERT INTO `accommodation_images` (`id`, `accommodationId`, `imagePath`) VALUES
(1, 1, 'balaton_panorama_1.jpg'),
(2, 1, 'balaton_panorama_2.jpg'),
(3, 1, 'balaton_panorama_3.jpg'),
(4, 1, 'balaton_panorama_4.jpg'),
(5, 2, 'buda_studio_1.jpg'),
(6, 2, 'buda_studio_2.jpg'),
(7, 2, 'buda_studio_3.jpg'),
(8, 3, 'heviz_villa_1.jpg'),
(9, 3, 'heviz_villa_2.jpg'),
(10, 3, 'heviz_villa_3.jpg'),
(11, 3, 'heviz_villa_4.jpg'),
(12, 3, 'heviz_villa_5.jpg'),
(13, 4, 'tokaj_vendeghaz_1.jpg'),
(14, 4, 'tokaj_vendeghaz_2.jpg'),
(15, 4, 'tokaj_vendeghaz_3.jpg'),
(16, 5, 'egerszalok_haz_1.jpg'),
(17, 5, 'egerszalok_haz_2.jpg'),
(18, 5, 'egerszalok_haz_3.jpg'),
(19, 5, 'egerszalok_haz_4.jpg');

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
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `isActive`, `createdAt`) VALUES
(1, 'reiciendis', 'bakos.jenő@example.net', 'fb079332fbda4ff8dc655740bb2c3bcd640011f3', '', 1, '2000-12-03 22:13:49'),
(2, 'numquam', 'ejakab@example.org', '8e9978fcbf36a028e0a1eb4df2e3628d57120bba', '', 1, '2013-04-05 02:51:37'),
(3, 'consequatur', 'ramóna64@example.net', '3939aab51b38ab2d612b26124bd5831ff0535a0f', '', 1, '2001-10-31 02:57:27'),
(4, 'quia', 'zsombor80@example.net', '61126e6f80db3e60642c042d82ae9b1b52ee2e27', '', 1, '2009-04-20 16:27:26'),
(5, 'aut', 'richárd.sipos@example.org', '56e304619d9552e1bbe5694a30d09f648e058b17', '', 1, '2000-09-06 15:22:47'),
(6, 'quaerat', 'lbálint@example.com', '583ce940495d98fba9e095ff060be8343613ab5f', '', 1, '1989-10-08 14:15:38'),
(7, 'dolorem', 'rlukács@example.net', '16644aa5baeedd4aecaa64a03bb776631e621418', '', 1, '1995-05-23 23:32:47'),
(8, 'inventore', 'kerekes.maja@example.org', 'b208716541df68eaa690dbd6f83b224898b09476', '', 1, '1999-12-08 14:37:22'),
(9, 'praesentium', 'nemes.antal@example.com', '3117dfce274f0cecb2ced4af89ded60e7655a3ef', '', 1, '1997-04-28 11:02:35'),
(10, 'maxime', 'török.zsóka@example.net', 'd447e17ef700e9fcf121a7ef1e282520defaa50c', '', 1, '2000-08-29 05:56:48'),
(11, 'ducimus', 'andrea76@example.net', 'ffe0ea03f2af80eb1b44ec8da90f47f35c662df8', '', 1, '1979-03-21 06:14:28'),
(12, 'et', 'boróka.kocsis@example.org', 'fe65036161ae65a56be71bfbab387f6450bfd8b7', '', 1, '1971-09-24 11:16:23'),
(13, 'sit', 'gál.gabriella@example.net', 'b8baeba60c15eeb234c9753bfb5803e7a6bc49d7', '', 1, '2010-04-01 15:38:41'),
(14, 'voluptatibus', 'balogh.léna@example.net', 'abce8b19eeff164d37b4a049fda01d5fce2d8dd6', '', 1, '1992-01-16 07:50:29'),
(15, 'qui', 'mmáté@example.org', 'cbd3ed75821d8011f58b9306f25b5e83481c9abf', '', 1, '2019-12-01 21:00:06'),
(16, 'voluptatibus', 'jános.pataki@example.org', '0bf8ebee6d054bcd8beee1a81c0ae08d1b96692d', '', 1, '2002-02-06 01:36:05'),
(17, 'fugiat', 'takács.zsóka@example.com', '2c7600ea008b3779bf541edc19bc4ea3b2fc6d8d', '', 1, '1991-01-01 10:57:47'),
(18, 'architecto', 'isimon@example.org', 'bb8759f685123730db93d649b2e7b7ba26589f64', '', 1, '1994-09-21 12:20:25'),
(19, 'et', 'vsipos@example.com', '979317a579b4f33ad617534edbf17f2288ba24fa', '', 1, '2015-10-12 16:25:12'),
(20, 'sequi', 'milla.péter@example.org', '8a82bcdfa19705472bfc37f85ddbd74508f92043', '', 1, '1978-11-09 21:38:15'),
(21, 'nihil', 'mfekete@example.net', '5c143a044f2c57ec19f3b2f3d66e5bf6a358f6fc', '', 1, '1971-04-18 21:05:47'),
(22, 'eos', 'dhegedűs@example.com', '78a4c0f6a92d6355d642e46b13e98be73f0a0977', '', 1, '2013-06-14 16:29:56'),
(23, 'iusto', 'péter71@example.com', 'bba039f2cf47b9d754cae36e39aaa7ff92c0bb13', '', 1, '1986-11-20 11:36:57'),
(24, 'quis', 'lászló98@example.org', '2d3d871bb5477643f7d4f37126cb02e308c39157', '', 1, '2003-12-25 18:07:04'),
(25, 'quia', 'váradi.liliána@example.org', '63a1971bcf91bab01f3c47de258c551dd195d101', '', 1, '1985-06-13 15:31:58'),
(26, 'deserunt', 'péter.marcell@example.com', 'efd7704a9299f2105aab31f36b46e46de4be4faa', '', 1, '1973-01-08 03:18:51'),
(27, 'nulla', 'rborbély@example.net', 'bcc49c6421ff14262e8f9d8ddc85f9d51f2a113c', '', 1, '1994-07-15 01:12:02'),
(28, 'autem', 'kis.míra@example.com', '03a07d61b9c8abb1336786775706b6a7553469b1', '', 1, '2013-02-14 10:19:47'),
(29, 'odio', 'ádám.németh@example.net', 'fe85c01ad7c50fe991372e231187e0d669d1e375', '', 1, '2014-10-02 11:05:15'),
(30, 'voluptas', 'kristóf.horváth@example.com', '60db96d7a9f31d24db91926b511fd3b4d50d9e33', '', 1, '2004-02-04 14:58:31'),
(31, 'qui', 'gabriella.váradi@example.net', 'b3362e64576dde074380a20e52ee50746ab0a5f0', '', 1, '1982-12-20 06:30:16'),
(32, 'at', 'ernő45@example.org', '1999ca39bea618f5097168494a30d22fd9b44bd3', '', 1, '2003-02-02 19:34:50'),
(33, 'temporibus', 'qdeák@example.com', '14d1650eedf2412c20c95e7f1ed1387251c265c8', '', 1, '1975-01-30 17:37:02'),
(34, 'voluptas', 'bognár.ramóna@example.com', '4c236e228ca90c72ab8454ee8df244741e3d545b', '', 1, '2005-07-02 10:59:30'),
(35, 'recusandae', 'hunor72@example.com', 'fe9c8cd7d1fd1653fa99280e8337460a7559cc85', '', 1, '2013-01-17 20:02:41'),
(36, 'recusandae', 'bfodor@example.com', '03507c92b8623217aaebade60b86a1027e0a6111', '', 1, '1990-11-01 19:35:44'),
(37, 'repellendus', 'zfarkas@example.org', 'f598b6f22bcc7eecc15fdd2c5965739834cbc6e0', '', 1, '1977-09-17 07:57:17'),
(38, 'et', 'dorottya16@example.net', '5c1f5996b880fc6415bbe0cc1ec9d2aee192bcde', '', 1, '2024-08-26 02:41:21'),
(39, 'aperiam', 'somogyi.szervác@example.net', 'e29f5b80504bfc517a2848088572ab7b0fc94cb3', '', 1, '1978-05-21 00:04:24'),
(40, 'et', 'noel.balogh@example.org', 'c739c7d6a6aefefe2dcb3a21c466d3bdce8cebbc', '', 1, '1992-08-03 04:08:00'),
(41, 'impedit', 'horsós@example.net', '9ccfdaaa56756e09c59e558074d532a4e3b514ff', '', 1, '1975-10-19 14:51:43'),
(42, 'quia', 'olivér77@example.org', '4abc93c8f43541e4c420209191566349f499d59f', '', 1, '1974-05-15 00:08:35'),
(43, 'iure', 'lváradi@example.net', '576700af1c262179b2d213dde2367cb65fe69464', '', 1, '1970-12-07 16:41:51'),
(44, 'voluptatem', 'lengyel.liza@example.org', '13ff709061efb6ee4416926e2d3200ef778e1462', '', 1, '2010-02-11 10:25:50'),
(45, 'nesciunt', 'attila.bodnár@example.net', 'd0e6f3420cdace298c63cce3d574fca92317c5f6', '', 1, '1999-03-27 05:18:45'),
(46, 'inventore', 'mátyás23@example.com', '6d16be6460e837e966687c8031ec5d04d20fc3c0', '', 1, '1972-12-12 19:11:13'),
(47, 'distinctio', 'orosz.katinka@example.net', 'fa873dba68be3e2a4ee0f76207b5295929234ab0', '', 1, '1981-04-18 11:23:58'),
(48, 'eaque', 'fhajdu@example.org', 'cdc42a5b1220afc500d0dd01eb65bb2ce654f5e9', '', 1, '1975-04-18 06:59:23'),
(49, 'sapiente', 'valéria.faragó@example.net', '05fb6404ab0d52d51c9a406bcdd3be4aba88f450', '', 1, '2022-08-16 07:29:13'),
(50, 'fugiat', 'kristóf73@example.net', '4c21720dcdd42a657d7a35fec295c90b9053d9d8', '', 1, '1976-04-08 23:13:48'),
(52, 'admin', 'admin', 'f865b53623b121fd34ee5426c792e5c33af8c227', 'admin', 1, '2025-12-09 09:02:54');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `accommodation_images`
--
ALTER TABLE `accommodation_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT a táblához `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
