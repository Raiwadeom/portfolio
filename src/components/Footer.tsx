import KineticContact from "./KineticContact";
import Visitors from "./Visitors";

/** Every page ends on the Kinetic closing: enquiry card, wordmark, footer columns. */
export default function Footer() {
  return (
    <div className="kin">
      <KineticContact
        lead="Let’s build|something bold."
        extra={<Visitors />}
      />
    </div>
  );
}
