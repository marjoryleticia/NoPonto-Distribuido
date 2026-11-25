
import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import api from '../api';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Parada {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  rota?: {
    nome: string;
  } | null;
}

interface Onibus {
  id: number;
  placa: string;
  modelo: string;
  status: string;
  rota?: {
    nome: string;
  } | null;
}

interface Localizacao {
  id: number;
  latitude: number;
  longitude: number;
  registradaEm: string;
  onibusId: number;
  onibus: Onibus;
}

interface ResultadoParadas {
  dados: Parada[];
  total: number;
}

const iconeOnibus = L.divIcon({
  className: '',
  html: `
    <div style="
      background-color: #123B5D;
      color: white;
      width: 36px;
      height: 36px;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    ">🚌</div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function AjustarMapa({
  paradas,
  localizacoes,
}: {
  paradas: Parada[];
  localizacoes: Localizacao[];
}) {
  const mapa = useMap();

  useEffect(() => {
    const coordenadas: [number, number][] = [
      ...paradas.map(
        (parada): [number, number] => [
          parada.latitude,
          parada.longitude,
        ],
      ),
      ...localizacoes.map(
        (localizacao): [number, number] => [
          localizacao.latitude,
          localizacao.longitude,
        ],
      ),
    ];

    if (coordenadas.length > 0) {
      mapa.fitBounds(L.latLngBounds(coordenadas), {
        padding: [40, 40],
      });
    }
  }, [paradas, localizacoes, mapa]);

  return null;
}

export default function MapaOnibus() {
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarDados() {
      try {
        setErro('');
            const [respostaParadas, respostaOnibus] = await Promise.all([
              api.get('/paradas', { params: { page: 1, limit: 100 } }),
              api.get('/localizacoes/ultimas'),
            ]);

            const resultadoParadas: ResultadoParadas = respostaParadas.data;

            const resultadoOnibus: Localizacao[] = respostaOnibus.data;

        setParadas(resultadoParadas.dados ?? []);
        setLocalizacoes(resultadoOnibus ?? []);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar o mapa.',
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  if (carregando) {
    return (
      <div className="h-96 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
        Carregando mapa...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="h-96 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
        {erro}
      </div>
    );
  }

  if (paradas.length === 0 && localizacoes.length === 0) {
    return (
      <div className="h-96 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-500">
        <p className="font-semibold">Nenhum dado disponível no mapa.</p>
        <p className="text-sm mt-2">
          Cadastre paradas e registre localizações de ônibus.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-5 mb-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#123B5D]" />
          Ônibus ({localizacoes.length})
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          Paradas ({paradas.length})
        </div>
      </div>

      <div className="h-96 w-full rounded-xl overflow-hidden">
        <MapContainer
          center={[-8.185, -35.591]}
          zoom={13}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {paradas.map((parada) => (
            <Marker
              key={`parada-${parada.id}`}
              position={[parada.latitude, parada.longitude]}
            >
              <Popup>
                <div>
                  <strong>{parada.nome}</strong>
                  <p className="mt-1">
                    Rota: {parada.rota?.nome ?? 'Sem rota associada'}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {localizacoes.map((localizacao) => (
            <Marker
              key={`onibus-${localizacao.onibusId}`}
              position={[
                localizacao.latitude,
                localizacao.longitude,
              ]}
              icon={iconeOnibus}
            >
              <Popup>
                <div>
                  <strong>Ônibus {localizacao.onibus.placa}</strong>
                  <p className="mt-1">
                    Modelo: {localizacao.onibus.modelo}
                  </p>
                  <p>Status: {localizacao.onibus.status}</p>
                  <p>
                    Rota: {localizacao.onibus.rota?.nome ?? 'Sem rota'}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Último registro:{' '}
                    {new Date(
                      localizacao.registradaEm,
                    ).toLocaleString('pt-BR')}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          <AjustarMapa
            paradas={paradas}
            localizacoes={localizacoes}
          />
        </MapContainer>
      </div>
    </div>
  );
}
