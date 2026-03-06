import RegisterForm from "./RegisterForm";
import { generateCaptcha } from "@/lib/captcha";
import { getRegistrationOpen } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const open = await getRegistrationOpen();
  const captcha = generateCaptcha();
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Form Pendaftaran Peserta</h1>
      <div className="rounded border border-gray-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
        <div className="space-y-3">
          <div className="text-lg font-semibold">Bismillah<span className="ml-1">،</span> Assalaamu&apos;alaikum Warohmatullah Wa Barokaatuh</div>
          <p className="text-slate-700">
            Ibadah i’tikaf bertujuan mulia yaitu untuk menggapai malam lailatul qadar yang punya keutamaan ibadah yang dilakukan lebih baik daripada 1000 bulan. Di antara tujuan i’tikaf adalah untuk menggapai malam tersebut. Dan yang paling utama bila i’tikaf dilakukan di sepuluh hari terakhir dari bulan Ramadhan. Mudah-mudahan kita diberikan jalan untuk melakukan ibadah i’tikaf tersebut demi mencontoh sunnah Nabi kita –shallallahu ‘alaihi wa sallam.
          </p>
          <div className="rounded bg-white border border-gray-200 p-3">
            <div className="text-center text-base leading-relaxed">
              عَنْ عَائِشَةَ رَضِيَ اَللَّهُ عَنْهَا قَالَتْ:- أَنَّ اَلنَّبِيَّ – صلى الله عليه وسلم – كَانَ يَعْتَكِفُ اَلْعَشْرَ اَلْأَوَاخِرَ مِنْ رَمَضَانَ, حَتَّى تَوَفَّاهُ اَللَّهُ, ثُمَّ اعْتَكَفَ أَزْوَاجُهُ مِنْ بَعْدِهِ – مُتَّفَقٌ عَلَيْهِ
            </div>
            <div className="mt-2 text-sm text-slate-700">
              Dari ‘Aisyah radhiyallahu ‘anha, ia berkata bahwasanya Nabi shallallahu ‘alaihi wa sallam biasa beri’tikaf di sepuluh hari terakhir dari bulan Ramadhan hingga beliau diwafatkan oleh Allah. Lalu istri-istri beliau beri’tikaf setelah beliau wafat. Muttafaqun ‘alaih. (HR. Bukhari no. 2026 dan Muslim no. 1172).
            </div>
          </div>
          <p className="text-slate-700">
            Masjid An-Naba&apos; Insyaa Allah membuka pendaftaran untuk peserta I&apos;tikaf pada 10 hari terakhir Ramadhan. Quota pendaftaran Insyaa Allah dibatasi sebanyak 100 peserta Ikhwan dari online.
          </p>
          <div className="space-y-2">
            <div className="font-medium">Program 10 malam terakhir:</div>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>Kegiatan Berbuka Puasa Bersama &amp; Sahur Bersama</li>
              <li>Tarawih bersama imam Syaikh Zeyad Al-Yamany</li>
              <li>Qiyamul lail di malam 10 terakhir bersama Asatidz / Syaikh</li>
              <li>Kajian Akhir pekan bersama pemateri Insya Allah Ustadz Mukhlis Abu Dzar</li>
              <li>Kajian I&apos;tikaf (Insya Allah)</li>
            </ol>
          </div>
          <div className="rounded border border-red-600 bg-red-50 text-red-800 px-3 py-2">
            ITIKAF UNTUK AKHWAT SUDAH FULL KUOTA, KHUSUS PESERTA IKHWAN SAJA
          </div>
          <div className="text-slate-700">
            Demikian kami sampaikan, syukron jazakumullaahu khairan wa barokallahu fiikum. Wassalaamu&apos;alaikum Warohmatullah Wa Barokaatuh.
          </div>
        </div>
      </div>
      {!open && (
        <div className="rounded border border-yellow-600 bg-yellow-50 text-yellow-800 px-3 py-2">
          Pendaftaran sudah ditutup.
        </div>
      )}
      <p className="text-slate-700">
        Isi Nomor HP, Nama, dan Alamat.
      </p>
      {open && <RegisterForm captcha={captcha} />}
    </section>
  );
}
