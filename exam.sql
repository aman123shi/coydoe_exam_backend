-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 15, 2022 at 02:40 PM
-- Server version: 8.0.31-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exam`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `firstName`, `lastName`, `phone`, `password`) VALUES
(1, 'Amanuel', 'shiferaw', '+251939320839', '$2b$10$3tfbxUV72/r9TwzknmgfYexxSvok20EGd9QWPHl/i7MvOSa4qk4h6');

-- --------------------------------------------------------

--
-- Table structure for table `course-sub-exam-category-entity`
--

CREATE TABLE `course-sub-exam-category-entity` (
  `id` int NOT NULL,
  `course` int NOT NULL,
  `subExamCategory` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `course-sub-exam-category-entity`
--

INSERT INTO `course-sub-exam-category-entity` (`id`, `course`, `subExamCategory`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 2, 2),
(4, 3, 1),
(5, 4, 3);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `examCategory` int NOT NULL,
  `examCategoryId` int DEFAULT NULL,
  `hasDirections` tinyint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `examCategory`, `examCategoryId`, `hasDirections`) VALUES
(1, 'Biology', 1, 1, 0),
(2, '12th Maths', 1, 1, 0),
(3, 'Physics', 1, 1, 0),
(4, 'English', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `directions`
--

CREATE TABLE `directions` (
  `id` int NOT NULL,
  `directionText` longtext NOT NULL,
  `sectionName` longtext,
  `directionNumber` int NOT NULL,
  `startQuestionNumber` int NOT NULL,
  `endQuestionNumber` int NOT NULL,
  `course` int NOT NULL,
  `courseYear` int NOT NULL,
  `passage` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `directions`
--

INSERT INTO `directions` (`id`, `directionText`, `sectionName`, `directionNumber`, `startQuestionNumber`, `endQuestionNumber`, `course`, `courseYear`, `passage`) VALUES
(1, 'The following words are NOT in the proper order. When put in the right order, they make correct English sentences. From the given alternative, choose the one that is correct.', 'word order ', 1, 1, 5, 4, 2014, NULL),
(2, 'when put in the correct order, sentences a – e/f in each of the questions 6-8 make up a complete paragraph. From the given alternative A-D given for each question, choose the letter that contains the correct order of the sentence', 'paragraph coherence', 2, 6, 9, 4, 2014, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `exam-categories`
--

CREATE TABLE `exam-categories` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `exam-categories`
--

INSERT INTO `exam-categories` (`id`, `name`) VALUES
(1, 'University Entrance Exam'),
(3, 'Law Exit Exam');

-- --------------------------------------------------------

--
-- Table structure for table `grouped-questions`
--

CREATE TABLE `grouped-questions` (
  `id` int NOT NULL,
  `questionText` longtext NOT NULL,
  `option_a` longtext NOT NULL,
  `option_b` longtext NOT NULL,
  `option_c` longtext NOT NULL,
  `option_d` longtext NOT NULL,
  `answer` longtext NOT NULL,
  `image` longtext,
  `description` longtext NOT NULL,
  `year` int NOT NULL,
  `questionNumber` int NOT NULL,
  `subExamCategory` int DEFAULT NULL,
  `subExamCategoryId` int DEFAULT NULL,
  `direction` int NOT NULL,
  `directionId` int DEFAULT NULL,
  `courseId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `grouped-questions`
--

INSERT INTO `grouped-questions` (`id`, `questionText`, `option_a`, `option_b`, `option_c`, `option_d`, `answer`, `image`, `description`, `year`, `questionNumber`, `subExamCategory`, `subExamCategoryId`, `direction`, `directionId`, `courseId`) VALUES
(1, 'It to wanted you today me do?', 'You wanted me to do it today.', 'Today you wanted it me to do.', 'Me wanted you to do it today.', 'It wanted me today you to do.', 'option_a', NULL, 'You wanted me to do it today', 2014, 1, NULL, NULL, 1, 1, 4),
(2, 'a. such people do it more for pleasure than necessity\r\nb. weekend is the best time for those who buy essential things for life.\r\nc. very few people can avoid shopping at least once a week.\r\nd. for some people, however, shopping has become a daily routine.\r\ne. shopping is a necessary part of life.', 'c d b a e', 'e d b c a', 'b d c e a', 'e c d a b', 'option_D', 'uyuyuyuy', 'Using \'e\' as a beginning sentences, the others develop or explain it', 2014, 2, 3, 3, 2, 2, 4);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int NOT NULL,
  `year` int NOT NULL,
  `course` int NOT NULL,
  `courseId` int DEFAULT NULL,
  `subExamCategoryId` int DEFAULT NULL,
  `subExamCategory` int DEFAULT NULL,
  `questionText` longtext NOT NULL,
  `option_a` longtext NOT NULL,
  `option_b` longtext NOT NULL,
  `option_c` longtext NOT NULL,
  `option_d` longtext NOT NULL,
  `answer` longtext NOT NULL,
  `image` longtext,
  `description` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `year`, `course`, `courseId`, `subExamCategoryId`, `subExamCategory`, `questionText`, `option_a`, `option_b`, `option_c`, `option_d`, `answer`, `image`, `description`) VALUES
(14, 2014, 2, 2, 1, 1, '', '', '', '', '', '', '', ''),
(15, 2014, 2, 2, 1, 1, '', '', '', '', '', '', '', ''),
(16, 2014, 2, 2, 1, 1, '', '', '', '', '', '', '', ''),
(17, 2014, 2, 2, 1, 1, '', '', '', '', '', '', '', ''),
(18, 2014, 2, 2, 1, 1, '', '', '', '', '', '', '', ''),
(19, 2014, 2, 2, 1, 1, '', '', '', '', '', '', '', ''),
(20, 2014, 2, 2, 1, 1, '', '', '', '', '', '', '', ''),
(21, 2014, 2, 2, 1, 1, '', '', '', '', '', '', '', ''),
(22, 2014, 2, 2, 1, 1, '', '', '', '', '', '', '', ''),
(61, 2014, 3, 3, NULL, NULL, 'Which of the following statement is correct about errors in measurement?', 'Error make measured values same as accepted instruments.', 'Error occur in every scientific investigation.', 'Experimental error is the same as a mistake.', 'Error can be avoided by using modern measuring instruments.', 'option_d', 'img/some-image.jpg', ' During measurement errors can be avoided by using modern measuring instruments'),
(62, 2014, 3, 3, NULL, NULL, 'What can be concluded when the number of significant figures increase?', 'Accuracy increases', 'Uncertainty increases', 'Precision increases', 'True reading increases.', 'option_a', 'img/some-image.jpg', ' when the number of significant figures increases during measurement the measured value is very close to the actual value and the measurement is more accurate or accuracy increases'),
(63, 2014, 3, 3, NULL, NULL, 'Tow forces F1= (8i+8J) N and F2 = (4i+6J) N are acting on an object. What is the magnitude and direction of the resultant force?', '5N,1430', '5N,-370', '225N,1430', '15N,370', 'option_d', 'img/some-image.jpg', ' The magnitude of the resultant force is  = 15N and 370'),
(64, 2014, 3, 3, NULL, NULL, 'Which of the following is not correct about magnetic field?', 'Magnetic field is produced by moving charge', 'Magnetic monopoles exist', 'The closer the field lines are, the strong the magnetic field.', 'Magnetic field lines are closed', 'option_d', 'img/some-image.jpg', ' magnetic field lines are closed lines without beginning and end.'),
(65, 2014, 3, 3, NULL, NULL, 'A car start moving from rest and its motion on a straight line is showing in the figure below. What is the average velocity of the car within the first 6 seconds?', 'C. 5 m/s', 'D. 6 m /st', 'A. 1.67 m/ s', 'B. 5.67 m/s', 'option_d', 'img/some-image.jpg', 'The average speed of the car during this time is Vave = Stot/t = 34m/6sec = 5.67m/'),
(66, 2014, 3, 3, NULL, NULL, 'Which one of the following statements is correct regarding the motion a plane?', 'The centripetal force for a body moving in either vertical or horizontal circle is toward the center.', 'In projectile motion the horizontal component of the motion is uniformly accelerated motion.', 'When a body moves in a vertical circle, its speed is constant.', 'When a body moves in a horizontal circle, its velocity is constant.', 'option_a', 'img/some-image.jpg', 'the centripetal force for a body moving in either vertical or horizontal circle is directed toward the center.'),
(67, 2014, 3, 3, NULL, NULL, ' A bullet is fired at an angle of 300 above the horizontal. If air resistance is neglected, what should be the bullet’s horizontal accelerated (ax) and vertical acceleration (ay) when it reach its maximum height?', 'Both ax and ay are zero.', 'Both ax and ay are 10 m/s2 downward', 'ax is 10 m/s downward, and ay is zero.', 'a x is zero and a y, is 10 m/s2 downward.', 'option_d', 'img/some-image.jpg', 'as the bullet reaches the max height (point A) its acceleration in the Y-axis is 10m/s2 in magnitude and direction down ward. Since the horizontal motion is uniform through ax = 0.'),
(68, 2014, 3, 3, NULL, NULL, 'Two students A and B, with masses mA and mg respectively, stand on a wheeled trolleys as shown in the figure below. If students A has larger mass and pushes student B, then what can be said about their accelerations?', 'The acceleration of student B is less than that of student A.', 'The acceleration of student A is less than that of student B.', 'There would be no acceleration because the force are equal and opposite.', 'Both boys will be accelerated by the same magnitude bat in opposite directions.', 'option_b', 'img/some-image.jpg', 'when student A pushes student B by exerting a force F to the right student B reacts by the same force in the opposite direction according to the statement of Newton’s third law of motion. Since they exert the same force on each other with mA > mB student B will have more acceleration after impact.'),
(69, 2014, 3, 3, NULL, NULL, 'For a constant force F, if the impulse imparted to the system is large, then what can conclude about the collision??', 'Kinetic energy is conserved.', 'The change in velocity is small.', 'The contact or impact time is large.', 'Linear momentum is conserved.', 'option_d', 'img/some-image.jpg', 'the impulse imparted by a Constance force F on is given by J = ∆p = F. ∆t . The impulse imparted is large when the contact or impact time is large because F is constant.'),
(70, 2014, 3, 3, NULL, NULL, ' An open trolley is rolling on a level surface without friction loss through a vertical downpour of rain, as shown in the in the figure belowAs the trolley rolls, an appreciable amount of rainwater accumulates in the cart. What will be the speed of the cart?', 'It decreases because of conservation of momentum.', 'It increases because of conservation of mechanical energy.', 'It decrease because of conservation of mechanical energy.', 'It remain the same because the raindrop are falling perpendicular to the direction of the cart’s motion.', 'option_a', 'img/some-image.jpg', 'the collision between the open trolley of mass m1 and the mass of a vertical downward of rain m2 is in elastic momentum is conserved..'),
(71, 2015, 3, 3, NULL, NULL, 'Which of the following is a correct statement about the first condition of equilibrium?', ' Clockwise moments should balance counter clockwise moments', ' The net force on an object must be zero.', 'B. The sum of all torques must be zero', 'D. The torque produced by a force should be perpendicular to the', 'option_b', NULL, 'the first condition of equilibrium states that the vector sum of all the force on an object must be zero. Thus ∑F  = 0 → ∑Fx = 0 and ∑Fy = 0'),
(72, 2014, 1, 1, NULL, NULL, 'Cells  were first seen using the microscope by:', 'Schwann', 'Leeuwenhoek', 'Schleiden', 'Robert Hooke', 'option_d', 'img/some-image.jpg', ' Robert Hooke is an English scientist who has first seen dead cork cells. He is also the first person to coin the name cell.'),
(73, 2014, 1, 1, NULL, NULL, 'Of the following organic molecules, which one includes a Pentose sugar?', 'Fructose', 'Galactose', 'Glucose', 'Deoxyribose', 'option_d', 'img/some-image.jpg', 'Pentose sugar is a 5 - carbon sugar which contains deoxy ribose sugar.'),
(74, 2014, 1, 1, NULL, NULL, 'In the energy pyramid, which group of organisms has the least amount of energy?', 'Tertiary produces', 'Primary producers', 'Animals', 'Herbivores', 'option_a', 'img/some-image.jpg', 'The energy content in a food chain decreases as trophic level increases.'),
(75, 2014, 1, 1, NULL, NULL, 'The ultimate source of genetic variation is?', 'Migration', 'Selection', ' Genetic drift', 'Mutation', 'option_d', 'img/some-image.jpg', 'Mutation is a sudden change in a genetic make-up of an organism. It results in genetic variation after successive generation.'),
(76, 2014, 1, 1, NULL, NULL, 'Which of the following is the first step in starting a research process?', 'Identification of problem', 'Searching for solutions to the problem', ' Searching sources of information to located problem.', 'Survey of related literature', 'option_a', 'img/some-image.jpg', 'Accepting or rejecting the hypothesi Drawing conclusion on a solution retadeol to a problem'),
(77, 2014, 1, 1, NULL, NULL, 'Which of the following is lacking in prokaryotic cells?', 'Cellulose', 'Cytosol', 'Ribosome', 'DNA strand', 'option_a', 'img/some-image.jpg', 'cellulose is a component of plant cell wall and not prokaryotic organisms'),
(78, 2014, 1, 1, NULL, NULL, 'What kind of nutrition do most of the decomposers have in general?', 'Endosymbiont nutrition', 'Chemosynthetic nutrition', 'Saprobiotic nutrition', 'Autotrophic nutrition', 'option_b', 'img/some-image.jpg', 'Chemosynthetic nutrition is decomposition of dead bodies of organisms carried out by bacterium and fungi'),
(79, 2014, 1, 1, NULL, NULL, 'The practice of modern agriculture that reduces crop biodiversity is:', 'Overgrazıng', 'Forest clearing', 'Growing few high yielding varieties', 'Growing landraces', 'option_c', 'img/some-image.jpg', 'Growing only high yielding varieties of crops may reduce the biodiversity of an ecosystem.'),
(80, 2014, 1, 1, NULL, NULL, 'One of the following is NOT true about protein synthesis in eukaryotes.', 'Transcription takes place in the nucleus', 'Both transcription and translation take place in the cytoplasm', 'mRNA is modified after transcription', 'Translation takes place in the cytoplasm', 'option_d', 'img/some-image.jpg', 'The process of translation takes place in the cytoplasm.'),
(81, 2014, 1, 1, NULL, NULL, 'How many molecules of glycerol and fatty acids, respectively, are needed to form 100 molecules of triglyceride fat?', '100 and 300', '50 and 50', '100 and 100', '150 and 400', 'option_c', 'img/some-image.jpg', ' 1 molecule of triglyceride has 3 fatty acid and 1 glycerol molecules. Thus, 100 molecules of triglyceride has 100');

-- --------------------------------------------------------

--
-- Table structure for table `sub-exam-categories`
--

CREATE TABLE `sub-exam-categories` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `examCategory` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sub-exam-categories`
--

INSERT INTO `sub-exam-categories` (`id`, `name`, `examCategory`) VALUES
(1, 'Natural ', 0),
(2, 'Social ', 0),
(3, 'Common', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `course-sub-exam-category-entity`
--
ALTER TABLE `course-sub-exam-category-entity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_acddb5643658b0a24785755b260` (`examCategoryId`);

--
-- Indexes for table `directions`
--
ALTER TABLE `directions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam-categories`
--
ALTER TABLE `exam-categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grouped-questions`
--
ALTER TABLE `grouped-questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_35f36d32feebbb2f08943b54987` (`directionId`),
  ADD KEY `FK_c019e2e696947ac5791570f6492` (`subExamCategoryId`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_a9d9e25d981da5f41a46949d25c` (`courseId`),
  ADD KEY `FK_a27609f5ab50d9be74b0223043e` (`subExamCategoryId`);

--
-- Indexes for table `sub-exam-categories`
--
ALTER TABLE `sub-exam-categories`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `course-sub-exam-category-entity`
--
ALTER TABLE `course-sub-exam-category-entity`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `directions`
--
ALTER TABLE `directions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `exam-categories`
--
ALTER TABLE `exam-categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `grouped-questions`
--
ALTER TABLE `grouped-questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `sub-exam-categories`
--
ALTER TABLE `sub-exam-categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `FK_acddb5643658b0a24785755b260` FOREIGN KEY (`examCategoryId`) REFERENCES `exam-categories` (`id`);

--
-- Constraints for table `grouped-questions`
--
ALTER TABLE `grouped-questions`
  ADD CONSTRAINT `FK_35f36d32feebbb2f08943b54987` FOREIGN KEY (`directionId`) REFERENCES `directions` (`id`),
  ADD CONSTRAINT `FK_c019e2e696947ac5791570f6492` FOREIGN KEY (`subExamCategoryId`) REFERENCES `sub-exam-categories` (`id`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `FK_a27609f5ab50d9be74b0223043e` FOREIGN KEY (`subExamCategoryId`) REFERENCES `sub-exam-categories` (`id`),
  ADD CONSTRAINT `FK_a9d9e25d981da5f41a46949d25c` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
