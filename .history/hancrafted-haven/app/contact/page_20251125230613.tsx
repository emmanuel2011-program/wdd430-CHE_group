import LogoutButton from "../logout/LogoutButton";
export default function ContactPage() {
  return (
    <main className="contact-page">
       <div className="mt-6">
        <LogoutButton />
      </div>
      <h1>Contact</h1>
      <p>Emmanuel Chukwunonso Okoye email: <strong>eokoye2@byupathway.edu</strong></p>
      <p>Djimy FRANCILLON email: <strong>dfrancillon@byupathway.edu</strong></p>
      <p>Daniel Adetaba Adongo email: <strong>dadongo@byupathway.edu</strong></p>
    </main>
  );
}