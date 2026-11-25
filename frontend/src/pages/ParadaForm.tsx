
import { useEffect, useState, type FormEvent } from 'react';
import api from '../services/api';
import type { Parada, ParadaPayload } from '../services/paradasService';

interface Rota {
  id: number;
  nome: string;
}

interface ParadaFormProps {
  parada?: Parada | null;
  onSalvar: (dados: ParadaPayload) => Promise<void>;
  onCancelar: () => void;
}

export default function ParadaForm({
  parada,
  onSalvar,
  onCancelar,
}: ParadaFormProps) {
  const [nome, setNome] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [rotaId, setRotaId] = useState('');
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [carregandoRotas, setCarregandoRotas] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const editando = Boolean(parada);

  useEffect(() => {
    setNome(parada?.nome ?? '');
    setLatitude(parada ? String(parada.latitude) : '');
    setLongitude(parada ? String(parada.longitude) : '');
    setRotaId(parada?.rotaId != null ? String(parada.rotaId) : '');
    setErro('');
  }, [parada]);

  useEffect(() => {
    async function buscarRotas() {
      try {
        setCarregandoRotas(true);

        const resposta = await api.get('/rotas', {
          params: {
            page: 1,
            limit: 100,
          },
        });
        setRotas(resposta.data.dados ?? []);
      } catch {
        setErro('Não foi possível carregar as rotas cadastradas.');
      } finally {
        setCarregandoRotas(false);
      }
    }

    buscarRotas();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro('');

    const lat = Number(latitude.replace(',', '.'));
    const lng = Number(longitude.replace(',', '.'));

    if (!nome.trim()) {
      setErro('Informe o nome da parada.');
      return;
    }

    if (latitude.trim() === '' || longitude.trim() === '') {
      setErro('Informe a latitude e a longitude.');
      return;
    }

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      setErro('A latitude deve estar entre -90 e 90.');
      return;
    }

    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      setErro('A longitude deve estar entre -180 e 180.');
      return;
    }

    try {
      setSalvando(true);

      await onSalvar({
        nome: nome.trim(),
        latitude: lat,
        longitude: lng,
        rotaId: rotaId === '' ? null : Number(rotaId),
      });
    } catch {
      setErro('Não foi possível salvar a parada.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="parada-form-overlay">
      <div className="parada-form-modal">
        <div className="parada-form-header">
          <div>
            <h2>{editando ? 'Editar parada' : 'Nova parada'}</h2>
            <p>
              {editando
                ? 'Atualize os dados da parada.'
                : 'Preencha os dados para cadastrar uma parada.'}
            </p>
          </div>

          <button
            type="button"
            className="parada-form-close"
            onClick={onCancelar}
            disabled={salvando}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="parada-form-fields">
            <label>
              Nome da parada
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Praça Central"
                maxLength={200}
                required
              />
            </label>

            <div className="parada-form-coordinates">
              <label>
                Latitude
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-8.123456"
                  min="-90"
                  max="90"
                  required
                />
              </label>

              <label>
                Longitude
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="-35.123456"
                  min="-180"
                  max="180"
                  required
                />
              </label>
            </div>

            <label>
              Rota associada
              <select
                value={rotaId}
                onChange={(e) => setRotaId(e.target.value)}
                disabled={carregandoRotas}
              >
                <option value="">
                  {carregandoRotas
                    ? 'Carregando rotas...'
                    : 'Sem rota associada'}
                </option>

                {rotas.map((rota) => (
                  <option key={rota.id} value={rota.id}>
                    {rota.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {erro && (
            <div className="parada-form-error">
              {erro}
            </div>
          )}

          <div className="parada-form-footer">
            <button
              type="button"
              className="parada-form-cancel"
              onClick={onCancelar}
              disabled={salvando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="parada-form-save"
              disabled={salvando || carregandoRotas}
            >
              {salvando
                ? 'Salvando...'
                : editando
                  ? 'Salvar alterações'
                  : 'Cadastrar parada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
