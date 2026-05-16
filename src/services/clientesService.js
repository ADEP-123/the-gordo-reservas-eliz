import { supabase } from "./supabaseClient";

function limpiarTexto(valor = "") {
  return valor.toString().trim();
}

function normalizarEmail(email = "") {
  return limpiarTexto(email).toLowerCase();
}

export const getClientes = async () => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener clientes:", error);
    return [];
  }

  return data;
};

export const getClienteById = async id => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener cliente:", error);
    return null;
  }

  return data;
};

export const getClienteByTelefono = async telefono => {
  const telefonoLimpio = limpiarTexto(telefono);

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("cliente_tel", telefonoLimpio)
    .maybeSingle();

  if (error) {
    console.error("Error al buscar cliente por teléfono:", error);
    return null;
  }

  return data;
};

export const getClienteByEmail = async email => {
  const emailLimpio = normalizarEmail(email);

  if (!emailLimpio) return null;

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("cliente_email", emailLimpio)
    .maybeSingle();

  if (error) {
    console.error("Error al buscar cliente por email:", error);
    return null;
  }

  return data;
};

export const crearCliente = async cliente => {
  const payload = {
    cliente_nombre: limpiarTexto(cliente.cliente_nombre),
    cliente_tel: limpiarTexto(cliente.cliente_tel),
    cliente_email: normalizarEmail(cliente.cliente_email) || null,
  };

  const { data, error } = await supabase
    .from("clientes")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error al crear cliente:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

export const actualizarCliente = async (id, cambios) => {
  const payload = {
    cliente_nombre: limpiarTexto(cambios.cliente_nombre),
    cliente_tel: limpiarTexto(cambios.cliente_tel),
    cliente_email: normalizarEmail(cambios.cliente_email) || null,
  };

  const { data, error } = await supabase
    .from("clientes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar cliente:", error);
    return { data: null, error };
  }

  return { data, error: null };
};

export const obtenerOCrearCliente = async cliente => {
  const clienteNormalizado = {
    cliente_nombre: limpiarTexto(cliente.cliente_nombre),
    cliente_tel: limpiarTexto(cliente.cliente_tel),
    cliente_email: normalizarEmail(cliente.cliente_email) || null,
  };

  let clienteExistente = await getClienteByTelefono(
    clienteNormalizado.cliente_tel,
  );

  if (!clienteExistente && clienteNormalizado.cliente_email) {
    clienteExistente = await getClienteByEmail(
      clienteNormalizado.cliente_email,
    );
  }

  if (clienteExistente) {
    return actualizarCliente(clienteExistente.id, clienteNormalizado);
  }

  return crearCliente(clienteNormalizado);
};
