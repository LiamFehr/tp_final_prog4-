import jsPDF from "jspdf";

export function exportRutinaToPDF(rutina) {
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text(`Rutina: ${rutina.nombre}`, 10, 10);

    let y = 20;

    Object.entries(rutina.ejercicios_por_dia).forEach(([dia, ejercicios]) => {
        pdf.setFontSize(12);
        pdf.text(dia, 10, y);
        y += 8;

        ejercicios.forEach(e => {
            pdf.setFontSize(10);
            pdf.text(
                `• ${e.nombre} - ${e.series}x${e.repeticiones} (${e.peso ?? 0}kg)`,
                12,
                y
            );
            y += 6;
        });

        y += 4;
    });

    // ✅ ESTA LÍNEA ES CLAVE PARA EL NOMBRE DEL ARCHIVO
    pdf.save(`rutina_${rutina.id}.pdf`);
}
