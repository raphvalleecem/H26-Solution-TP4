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
 * Calcule le temps corrigé en fonction du temps écoulé et du handicap du bateau
 * Formule: temps corrigé = temps écoulé × 1000 / handicap
 *
 * @param elapsedTime - Temps écoulé en secondes
 * @param handicapValue - Valeur du handicap du bateau
 * @returns Le temps corrigé
 */
export function calculateCorrectedTime(elapsedTime: number, handicapValue: number): number {
    if (handicapValue === 0) {
        console.warn("Warning: Handicap value is 0, cannot calculate corrected time");
        return 0;
    }
    return (elapsedTime * 1000) / handicapValue;
}
