// lib/contentful.ts
import { Document } from "@contentful/rich-text-types";
import { unstable_cache } from "next/cache";

// Utility function to generate URL-friendly slugs from names
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// GraphQL endpoint
const GRAPHQL_ENDPOINT = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

// GraphQL query for distributors list (minimal data)
const FABRICANTES_QUERY = `
  query GetFabricantes {
    fabricanteCollection {
      items {
        sys { id }
        nombre
        logo {
          url
        }
        descripcionCorta
      }
    }
  }
`;

// GraphQL query for all fabricantes with complete data (for slug lookup)
const ALL_FABRICANTES_COMPLETE_QUERY = `
  query GetAllFabricantesComplete {
    fabricanteCollection {
      items {
        sys { id }
        nombre
        logo {
          url
        }
        descripcionCorta
        descripcionLarga {
          json
        }
        imagenPortada {
          url
        }
        link
      }
    }
  }
`;

// GraphQL query for products by fabricante
const PRODUCTOS_BY_FABRICANTE_QUERY = `
  query GetProductosByFabricante($fabricanteId: String!) {
  productoCollection(
    where: { fabricante: { sys: { id: $fabricanteId } } }
  ) {
    items {
      sys { id }
      nombre
      descripcionCorta
      categoria
      portada {
        url
      }
      logoPortada {
        url
      }
    }
  }
}


`;

// GraphQL query for static generation (includes nombre for slug generation)
const FABRICANTE_SLUGS_QUERY = `
  query GetFabricanteSlugs {
    fabricanteCollection {
      items {
        sys { id }
        nombre
      }
    }
  }
`;

// GraphQL query for all products with complete data (for slug lookup)
const ALL_PRODUCTOS_COMPLETE_QUERY = `
  query GetAllProductosComplete {
    productoCollection(limit: 50) {
      items {
        sys { id }
        nombre
        descripcionCorta
        descripcionLarga {
          json
        }
        parrafo2 {
          json
        }
        bullets
        parrafo3 {
          json
        }
        portada {
          url
        }
        imagenesCollection(limit: 10) {
          items {
            url
          }
        }
        fichaTecnica {
          url
          title
        }
        videoCollection(limit: 3) {
          items {
            url
            contentType
            title
          }
        }
        youtubeUrl
        fabricante {
          sys { id }
          nombre
          logo { url }
        }
      }
    }
  }
`;

// GraphQL query for product slugs (includes nombre for slug generation)
const PRODUCTO_SLUGS_QUERY = `
  query GetProductoSlugs {
    productoCollection {
      items {
        sys { id }
        nombre
      }
    }
  }
`;

// GraphQL query for main products (principal = true)
const PRODUCTOS_PRINCIPALES_QUERY = `
  query GetProductosPrincipales {
    productoCollection(where: { principal: true }) {
      items {
        sys { id }
        nombre
        descripcionCorta
        categoria
        portada {
          url
        }
        logoPortada {
          url
        }
      }
    }
  }
`;

// GraphQL query for news/publications
const NOTICIAS_QUERY = `
  query GetNoticias {
    noticiaCollection(limit: 6, order: fechaPublicacion_DESC) {
      items {
        sys { id }
        titulo
        slug
        url
        extracto
        contenido {
          json
        }
        imagenDestacada {
          url
        }
        fechaPublicacion
        autor
      }
    }
  }
`;

// GraphQL query for single news by slug
const NOTICIA_BY_SLUG_QUERY = `
  query GetNoticiaBySlug($slug: String!) {
    noticiaCollection(where: { slug: $slug }, limit: 1) {
      items {
        sys { id }
        titulo
        slug
        url
        extracto
        contenido {
          json
        }
        imagenDestacada {
          url
        }
        fechaPublicacion
        autor
      }
    }
  }
`;

// GraphQL response types (raw data from Contentful)
interface FabricanteGraphQLResponse {
  sys: { id: string };
  nombre: string;
  logo: { url: string };
  descripcionCorta: string;
}

interface ProductoGraphQLResponse {
  sys: { id: string };
  nombre: string;
  descripcionCorta: string;
  categoria: string | null;
  portada: { url: string };
  logoPortada: { url: string } | null;
}

interface FabricanteCompleteGraphQLResponse {
  sys: { id: string };
  nombre: string;
  logo: { url: string };
  descripcionCorta: string;
  descripcionLarga: { json: Document };
  imagenPortada: { url: string };
  link: string | null;
}

interface ProductoCompleteGraphQLResponse {
  sys: { id: string };
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: { json: Document };
  parrafo2?: { json: Document } | null;
  bullets?: string | null;
  parrafo3?: { json: Document } | null;
  portada: { url: string };
  imagenesCollection: {
    items: { url: string }[];
  };
  fichaTecnica?: {
    url: string;
    title: string;
  };
  videoCollection?: {
    items: { url: string; contentType: string; title: string }[];
  } | null;
  youtubeUrl?: string | null;
  fabricante?: {
    sys: { id: string };
    nombre: string;
    logo?: { url: string } | null;
  } | null;
}

interface NoticiaGraphQLResponse {
  sys: { id: string };
  titulo: string;
  slug: string;
  url: string | null;
  extracto: string;
  contenido: { json: Document };
  imagenDestacada: { url: string };
  fechaPublicacion: string;
  autor: string | null;
}

// Application types (processed data for the app)
export interface Distributor {
  id: string;
  slug: string;
  nombre: string;
  logo: string;
  descripcion_corta: string;
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion_corta: string;
  categoria: string | null;
  imagen_portada: string;
  logo_portada: string;
}

export interface Noticia {
  id: string;
  slug: string;
  url: string | null;
  titulo: string;
  extracto: string;
  contenido: Document;
  imagen_destacada: string;
  fecha_publicacion: string;
  autor: string | null;
}

export interface Fabricante {
  id: string;
  slug: string;
  nombre: string;
  logo: string;
  descripcion_corta: string;
  descripcion_larga: Document;
  imagen_portada: string;
  productos: Producto[];
  link: string | null;
}

export interface ProductoCompleto {
  id: string;
  slug: string;
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: Document;
  parrafo2?: Document | null;
  bullets?: string[] | null;
  parrafo3?: Document | null;
  imagen_portada: string;
  imagenes: string[];
  ficha_tecnica?: {
    url: string;
    title: string;
  };
  videos?: { url: string; contentType: string; title: string }[] | null;
  youtubeUrl?: string | null;
  fabricante?: {
    id: string;
    slug: string;
    nombre: string;
    logo: string | null;
  } | null;
}

const FABRICANTE_ORDER = [
  "tratamiento-de-estiercol-eggpertise",
  "eggpertise-compostaje",
  "dacs",
  "winterwarm",
  "farmrob",
  "jaulas",
  "sistemas-de-jaulas",
  "sime-tek",
  "landmeco",
];

const PRODUCTO_PRINCIPAL_ORDER = [
  "sistema-de-compostaje-y-biodigestion",
  "magfan-plus",
  "calefactor-dxc-80",
  "jaulas-de-cria-recria",
];

function getProductoPrincipalOrderIndex(producto: Producto): number {
  const orderIndex = PRODUCTO_PRINCIPAL_ORDER.indexOf(producto.slug);

  return orderIndex === -1 ? Number.MAX_SAFE_INTEGER : orderIndex;
}

function sortProductosPrincipales(productos: Producto[]): Producto[] {
  return [...productos].sort((a, b) => {
    const orderDiff =
      getProductoPrincipalOrderIndex(a) - getProductoPrincipalOrderIndex(b);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
  });
}

function getFabricanteOrderIndex(distributor: Distributor): number {
  const slug = distributor.slug;
  const normalizedName = generateSlug(distributor.nombre);
  const orderIndex = FABRICANTE_ORDER.findIndex(
    (orderedSlug) => orderedSlug === slug || orderedSlug === normalizedName
  );

  return orderIndex === -1 ? Number.MAX_SAFE_INTEGER : orderIndex;
}

function sortFabricantes(distributors: Distributor[]): Distributor[] {
  return [...distributors].sort((a, b) => {
    const orderDiff = getFabricanteOrderIndex(a) - getFabricanteOrderIndex(b);

    if (orderDiff !== 0) {
      return orderDiff;
    }

    return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
  });
}

// GraphQL parsing functions
function parseDistributorFromGraphQL(
  item: FabricanteGraphQLResponse
): Distributor {
  return {
    id: item.sys.id,
    slug: generateSlug(item.nombre),
    nombre: item.nombre,
    logo: item.logo.url,
    descripcion_corta: item.descripcionCorta,
  };
}

function parseProductoFromGraphQL(item: ProductoGraphQLResponse): Producto {
  return {
    id: item.sys.id,
    slug: generateSlug(item.nombre),
    nombre: item.nombre,
    descripcion_corta: item.descripcionCorta,
    categoria: item.categoria,
    imagen_portada: item.portada.url,
    logo_portada: item.logoPortada?.url || item.portada.url,
  };
}

function parseNoticiaFromGraphQL(item: NoticiaGraphQLResponse): Noticia {
  return {
    id: item.sys.id,
    slug: item.slug || generateSlug(item.titulo),
    url: item.url || null,
    titulo: item.titulo,
    extracto: item.extracto,
    contenido: item.contenido.json,
    imagen_destacada: item.imagenDestacada.url,
    fecha_publicacion: item.fechaPublicacion,
    autor: item.autor,
  };
}

function parseFabricanteFromGraphQL(
  item: FabricanteCompleteGraphQLResponse
): Fabricante {
  return {
    id: item.sys.id,
    slug: generateSlug(item.nombre),
    nombre: item.nombre,
    logo: item.logo.url,
    descripcion_corta: item.descripcionCorta,
    descripcion_larga: item.descripcionLarga.json,
    imagen_portada: item.imagenPortada.url,
    productos: [], // Will be populated separately
    link: item.link,
  };
}

function parseProductoCompletoFromGraphQL(
  item: ProductoCompleteGraphQLResponse
): ProductoCompleto {
  return {
    id: item.sys.id,
    slug: generateSlug(item.nombre),
    nombre: item.nombre,
    descripcion_corta: item.descripcionCorta,
    descripcion_larga: item.descripcionLarga.json,
    parrafo2: item.parrafo2?.json || null,
    bullets: item.bullets
      ? item.bullets.split(",").map((b) => b.trim()).filter(Boolean)
      : null,
    parrafo3: item.parrafo3?.json || null,
    imagen_portada: item.portada.url,
    imagenes: item.imagenesCollection.items.map((img) => img.url),
    ficha_tecnica: item.fichaTecnica
      ? {
          url: item.fichaTecnica.url,
          title: item.fichaTecnica.title,
        }
      : undefined,
    videos: item.videoCollection?.items?.length
      ? item.videoCollection.items
      : null,
    youtubeUrl: item.youtubeUrl || null,
    fabricante: item.fabricante
      ? {
          id: item.fabricante.sys.id,
          slug: generateSlug(item.fabricante.nombre),
          nombre: item.fabricante.nombre,
          logo: item.fabricante.logo?.url ?? null,
        }
      : null,
  };
}

// GraphQL helper function
async function graphqlRequest(query: string, variables?: Record<string, any>) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

// GraphQL-based functions
export async function getFabricantes(): Promise<Distributor[]> {
  try {
    const response = await graphqlRequest(FABRICANTES_QUERY);
    const fabricantes = response.data.fabricanteCollection
      .items as FabricanteGraphQLResponse[];
    return sortFabricantes(fabricantes.map(parseDistributorFromGraphQL));
  } catch (error) {
    console.error("Error fetching fabricantes:", error);
    return [];
  }
}

export async function getProductosByFabricante(
  fabricanteId: string
): Promise<Producto[]> {
  try {
    const response = await graphqlRequest(PRODUCTOS_BY_FABRICANTE_QUERY, {
      fabricanteId,
    });
    const productos = response.data.productoCollection
      .items as ProductoGraphQLResponse[];
    return productos.map(parseProductoFromGraphQL);
  } catch (error) {
    console.error("Error fetching productos by fabricante:", error);
    return [];
  }
}

export async function getFabricanteBySlug(
  slug: string
): Promise<Fabricante | null> {
  try {
    const response = await graphqlRequest(ALL_FABRICANTES_COMPLETE_QUERY);
    const fabricantes = response.data.fabricanteCollection
      .items as FabricanteCompleteGraphQLResponse[];

    // Find fabricante by matching generated slug
    const found = fabricantes.find(
      (item) => generateSlug(item.nombre) === slug
    );

    if (!found) {
      return null;
    }

    const fabricante = parseFabricanteFromGraphQL(found);

    // Fetch products for this fabricante
    const productos = await getProductosByFabricante(fabricante.id);
    return {
      ...fabricante,
      productos,
    };
  } catch (error) {
    console.error("Error fetching fabricante by slug:", error);
    return null;
  }
}

export async function getAllFabricanteSlugs(): Promise<string[]> {
  try {
    const response = await graphqlRequest(FABRICANTE_SLUGS_QUERY);
    const fabricantes = response.data.fabricanteCollection.items as {
      sys: { id: string };
      nombre: string;
    }[];
    return fabricantes.map((item) => generateSlug(item.nombre));
  } catch (error) {
    console.error("Error fetching fabricante slugs:", error);
    return [];
  }
}

async function fetchProductoBySlug(
  slug: string
): Promise<ProductoCompleto | null> {
  const response = await graphqlRequest(ALL_PRODUCTOS_COMPLETE_QUERY);
  const productos = response.data.productoCollection
    .items as ProductoCompleteGraphQLResponse[];

  // Find producto by matching generated slug
  const found = productos.find((item) => generateSlug(item.nombre) === slug);

  if (!found) {
    return null;
  }

  return parseProductoCompletoFromGraphQL(found);
}

export async function getProductoBySlug(
  slug: string
): Promise<ProductoCompleto | null> {
  try {
    return await fetchProductoBySlug(slug);
  } catch (error) {
    console.error("Error fetching producto by slug:", error);
    return null;
  }
}

// How long the forms reuse a product lookup, in seconds. Fetching the whole
// catalog on every submission is slow and needless.
const PRODUCT_LOOKUP_REVALIDATE_SECONDS = 300;

/**
 * Looks a product up for the forms. Unlike getProductoBySlug it throws when
 * Contentful fails, so "the product does not exist" (null) can be told apart
 * from "Contentful is down". Results are cached; errors are not.
 */
export const getProductoForForm = unstable_cache(
  fetchProductoBySlug,
  ["producto-for-form"],
  { revalidate: PRODUCT_LOOKUP_REVALIDATE_SECONDS }
);

export async function getAllProductoSlugs(): Promise<string[]> {
  try {
    const response = await graphqlRequest(PRODUCTO_SLUGS_QUERY);
    const productos = response.data.productoCollection.items as {
      sys: { id: string };
      nombre: string;
    }[];
    return productos.map((item) => generateSlug(item.nombre));
  } catch (error) {
    console.error("Error fetching producto slugs:", error);
    return [];
  }
}

export async function getProductosPrincipales(): Promise<Producto[]> {
  try {
    const response = await graphqlRequest(PRODUCTOS_PRINCIPALES_QUERY);
    const productos = response.data.productoCollection
      .items as ProductoGraphQLResponse[];
    return sortProductosPrincipales(productos.map(parseProductoFromGraphQL));
  } catch (error) {
    console.error("Error fetching productos principales:", error);
    return [];
  }
}

export async function getNoticias(): Promise<Noticia[]> {
  try {
    const response = await graphqlRequest(NOTICIAS_QUERY);
    const noticias = response.data.noticiaCollection
      .items as NoticiaGraphQLResponse[];
    return noticias.map(parseNoticiaFromGraphQL);
  } catch (error) {
    console.error("Error fetching noticias:", error);
    return [];
  }
}

export async function getNoticiaBySlug(
  slug: string
): Promise<Noticia | null> {
  try {
    const response = await graphqlRequest(NOTICIA_BY_SLUG_QUERY, { slug });
    const noticias = response.data.noticiaCollection
      .items as NoticiaGraphQLResponse[];
    if (noticias.length === 0) {
      return null;
    }
    return parseNoticiaFromGraphQL(noticias[0]);
  } catch (error) {
    console.error("Error fetching noticia by slug:", error);
    return null;
  }
}
