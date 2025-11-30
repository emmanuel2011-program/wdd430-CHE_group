import LogoutButton from "@/app/logout/LogoutButton";


export default function ContactPage() {
  return (
    <main className="contact-page">
       <div className="mt-6">
        <LogoutButton />
      </div>
      <h1>Contact</h1>
      <p>Emmanuel Chukwunonso Okoye email: <strong>eokoye2@byupathway.edu</strong></p>
      <p>Chioma Francisca Ezekwe email: <strong>cezekwe@byupathway.edu</strong></p>
      <p>Holly Anne Briggs email: <strong>hbriggs@byupathway.edu</strong></p>
      <p>RayVen kenneth Shellhart: <strong>rshellhart@byupathway.edu</strong></p>
    </main>
  );
}