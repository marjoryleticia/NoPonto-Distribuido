
import { useState } from 'react'
import api from '../services/api'

function SimuladorOnibus() {
  const [onibusId, setOnibusId] = useState('2')
  const [status, setStatus] = useState('Parado')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [watchId, setWatchId] = useState<number | null>(null)

  function iniciarRastreamento() {
    if (!navigator.geolocation) {
      setErro('Seu navegador não oferece suporte ao GPS.')
      return
    }

    setErro('')
    setStatus('Buscando localização...')

    const id = navigator.geolocation.watchPosition(
      async (posicao) => {
        const lat = posicao.coords.latitude
        const lon = posicao.coords.longitude

        setLatitude(lat)
        setLongitude(lon)

        try {
          await api.post('/localizacoes', {
            latitude: lat,
            longitude: lon,
            onibusId: Number(onibusId),
          })

          setStatus('Rastreamento ativo')
        } catch {
          setStatus('Erro ao enviar localização')
          setErro('Não foi possível enviar a localização ao servidor.')
        }
      },
      (error) => {
        setStatus('Erro no GPS')
        setErro(error.message)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    )

    setWatchId(id)
  }

  function pararRastreamento() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }

    setStatus('Rastreamento parado')
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2">
        Rastreamento do ônibus
      </h2>

      <p className="text-slate-500 mb-5">
        Utilize o GPS do celular para enviar a localização do veículo.
      </p>

      <label className="block text-sm font-medium mb-2">
        ID do ônibus
      </label>

      <input
        type="number"
        min="1"
        value={onibusId}
        onChange={(e) => setOnibusId(e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={iniciarRastreamento}
          disabled={watchId !== null || !onibusId || Number(onibusId) <= 0}
          className="bg-emerald-600 text-white px-5 py-3 rounded-xl disabled:opacity-50"
        >
          Iniciar rastreamento
        </button>

        <button
          onClick={pararRastreamento}
          disabled={watchId === null}
          className="bg-red-600 text-white px-5 py-3 rounded-xl disabled:opacity-50"
        >
          Parar
        </button>
      </div>

      <div className="mt-6 space-y-2 text-slate-700">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Latitude:</strong> {latitude ?? 'Aguardando...'}</p>
        <p><strong>Longitude:</strong> {longitude ?? 'Aguardando...'}</p>
      </div>

      {erro && (
        <p className="mt-4 p-3 rounded-lg bg-red-50 text-red-700">
          {erro}
        </p>
      )}
    </section>
  )
}

export default SimuladorOnibus
