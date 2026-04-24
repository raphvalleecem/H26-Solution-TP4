/**
 * Service de calcul pour les courses nautiques
 */

/**
 * Calcule le temps écoulé
 * Formule: temps écoulé = temps d'arrivée - temps de départ
 *
 * @param finishTime - Heure d'arrivée
 * @param startTime - Heure de départ
 * @returns Le temps écoulé en secondes
 */
export function calculateElapsedTime(finishTime: Date, startTime: Date): number {
    const finishMs = finishTime.getTime();
    const startMs = startTime.getTime();

    if (finishMs < startMs) {
        console.warn("Warning: Finish time is before start time");
        return 0;
    }

    // Retourner le temps écoulé en secondes
    return (finishMs - startMs) / 1000;
}

/**
 * Calcule le temps corrigé selon le type de handicap
 *
 * Pour PY (entier 4 chiffres):
 *   temps corrigé = temps écoulé × 1000 / handicap PY
 *
 * Pour TMF (décimal 3 chiffres, ex: 0.977):
 *   temps corrigé = temps écoulé × handicap TMF
 *
 * Le résultat est arrondi à la seconde la plus proche (0.5 arrondit à l'entier supérieur)
 *
 * @param elapsedTime - Temps écoulé en secondes
 * @param handicapValue - Valeur du handicap (PY ou TMF)
 * @param handicapTypeName - Nom du type de handicap ("PY" ou "TMF")
 * @returns Le temps corrigé arrondi à la seconde la plus proche
 */
export function calculateCorrectedTime(
    elapsedTime: number,
    handicapValue: number,
    handicapTypeName: string
): number {
    if (handicapValue === 0) {
        console.warn("Warning: Handicap value is 0, cannot calculate corrected time");
        return 0;
    }

    let correctedTime: number;

    if (handicapTypeName.toUpperCase() === "PY") {
        // Formule PY: temps corrigé = temps écoulé × 1000 / handicap PY
        correctedTime = (elapsedTime * 1000) / handicapValue;
    } else if (handicapTypeName.toUpperCase() === "TMF") {
        // Formule TMF: temps corrigé = temps écoulé × handicap TMF
        correctedTime = elapsedTime * handicapValue;
    } else {
        console.warn(`Warning: Unknown handicap type "${handicapTypeName}"`);
        return 0;
    }

    // Arrondir à la seconde la plus proche (0.5 arrondit à l'entier supérieur)
    return Math.round(correctedTime);
}
