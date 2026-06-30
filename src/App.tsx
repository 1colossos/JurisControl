import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Processos } from "./pages/Processos";
import { ProcessoForm } from "./pages/ProcessoForm";
import { ProcessoDetalhe } from "./pages/ProcessoDetalhe";
import { Clientes } from "./pages/Clientes";
import { Calendario } from "./pages/Calendario";
import { Relatorios } from "./pages/Relatorios";
import { Configuracoes } from "./pages/Configuracoes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="processos" element={<Processos />} />
        <Route path="processos/novo" element={<ProcessoForm />} />
        <Route path="processos/:id/editar" element={<ProcessoForm />} />
        <Route path="processos/:id" element={<ProcessoDetalhe />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
