export type SireneV3Response = {
  header: {
    statut: number;
    message: string;
  };
  etablissement: {
    siren: string;
    siret: string;
    uniteLegale: {
      denominationUniteLegale: string;
    };
    adresseEtablissement: AdresseEtablissement;
  };
};

export type AdresseEtablissement = {
  complementAdresseEtablissement: string | null;
  numeroVoieEtablissement: string | null;
  indiceRepetitionEtablissement: string | null;
  typeVoieEtablissement: string | null;
  libelleVoieEtablissement: string | null;
  codePostalEtablissement: string | null;
  libelleCommuneEtablissement: string | null;
};
