import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectCard from "@/components/ProjectCard";
import { getDashT } from "@/lib/dashboard-i18n";

const t = getDashT("es");

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

// Mock fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ProjectCard", () => {
  const props = {
    id: "abc-123",
    name: "Mi proyecto",
    description: "Descripción del proyecto",
    t,
    createdAt: "2025-01-15T10:00:00Z",
  };

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("muestra el nombre del proyecto", () => {
    render(<ProjectCard {...props} />);
    expect(screen.getByText("Mi proyecto")).toBeInTheDocument();
  });

  it("muestra la descripción si existe", () => {
    render(<ProjectCard {...props} />);
    expect(screen.getByText("Descripción del proyecto")).toBeInTheDocument();
  });

  it("no muestra descripción si es null", () => {
    render(<ProjectCard {...props} description={null} />);
    expect(screen.queryByText("Descripción del proyecto")).not.toBeInTheDocument();
  });

  it("muestra botón Eliminar inicialmente", () => {
    render(<ProjectCard {...props} />);
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
  });

  it("cambia a '¿Confirmar?' al primer clic", () => {
    render(<ProjectCard {...props} />);
    fireEvent.click(screen.getByText("Eliminar"));
    expect(screen.getByText("¿Confirmar?")).toBeInTheDocument();
  });

  it("llama a DELETE en el segundo clic (confirmación)", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    render(<ProjectCard {...props} />);

    fireEvent.click(screen.getByText("Eliminar"));
    fireEvent.click(screen.getByText("¿Confirmar?"));

    expect(mockFetch).toHaveBeenCalledWith("/api/projects/abc-123", { method: "DELETE" });
  });
});
