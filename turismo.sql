-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 23-Set-2025 às 08:23
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `turismo`
--
CREATE DATABASE IF NOT EXISTS `turismo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `turismo`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `pontos_turisticos`
--

CREATE TABLE `pontos_turisticos` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cidade` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `preco_estimado` decimal(10,2) DEFAULT NULL,
  `duracao_media` int(11) DEFAULT NULL,
  `horario_funcionamento` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `pontos_turisticos`
--

INSERT INTO `pontos_turisticos` (`id`, `nome`, `cidade`, `descricao`, `categoria`, `preco_estimado`, `duracao_media`, `horario_funcionamento`) VALUES
(1, 'Elevador Lacerda', 'Salvador', 'Cartão postal que liga a cidade baixa à cidade alta.', 'cultural', 100.00, 30, '08:00-20:00'),
(2, 'Pelourinho', 'Salvador', 'Centro histórico com casarões coloridos e igrejas.', 'histórico', 0.00, 120, 'Livre'),
(3, 'Praia do Farol da Barra', 'Salvador', 'Praia famosa com vista para o farol.', 'praia', 0.00, 180, 'Livre');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `pontos_turisticos`
--
ALTER TABLE `pontos_turisticos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `pontos_turisticos`
--
ALTER TABLE `pontos_turisticos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- Adicione esta tabela ao seu banco de dados turismo
CREATE TABLE usuarios (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tipo ENUM('user', 'adm', 'adm-prefeitura') DEFAULT 'user',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);