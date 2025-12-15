-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Dec 15. 08:41
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

--
-- A tábla adatainak kiíratása `bookings`
--

INSERT INTO `bookings` (`id`, `userId`, `accommodationId`, `startDate`, `endDate`, `persons`, `totalPrice`, `status`, `createdAt`) VALUES
(1, 53, 1, '2025-06-10', '2025-06-13', 2, 75000, 1, '2025-12-15 07:40:59'),
(2, 54, 2, '2025-05-20', '2025-05-22', 2, 36000, 1, '2025-12-15 07:40:59'),
(3, 55, 3, '2025-07-01', '2025-07-05', 5, 180000, 1, '2025-12-15 07:40:59'),
(4, 56, 4, '2025-08-15', '2025-08-18', 4, 66000, 1, '2025-12-15 07:40:59');

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
(1, 'admin', 'admin', 'f865b53623b121fd34ee5426c792e5c33af8c227', 'admin', 1, '2025-12-15 07:40:31'),
(2, 'Kiss Ádám', 'kiss.adam@example.com', 'cbfdac6008f9cab4083784cbd1874f76618d2a97', 'user', 1, '2025-12-15 07:40:52'),
(3, 'Nagy Eszter', 'nagy.eszter@example.com', 'cbfdac6008f9cab4083784cbd1874f76618d2a97', 'user', 1, '2025-12-15 07:40:52'),
(4, 'Tóth Bence', 'toth.bence@example.com', 'cbfdac6008f9cab4083784cbd1874f76618d2a97', 'user', 1, '2025-12-15 07:40:52'),
(5, 'Szabó Lilla', 'szabo.lilla@example.com', 'cbfdac6008f9cab4083784cbd1874f76618d2a97', 'user', 1, '2025-12-15 07:40:52');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
