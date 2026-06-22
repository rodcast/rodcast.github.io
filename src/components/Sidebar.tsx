import Image from 'next/image';
import SocialLinks from './SocialLinks';

/** Profile sidebar */
export default function Sidebar() {
  return (
    <aside className="relative [grid-area:sidebar]" id="about">
      <Image
        src="/rodrigo-castilho-rodcast_photo.jpg"
        width={125}
        height={125}
        alt="Professional headshot of Rodrigo Castilho, Staff Frontend Engineer"
        className="mx-auto mb-4 block h-[120px] w-[120px] rounded-full border-[5px] border-[var(--tertiary-color)] [transition:all_0.2s]"
        itemProp="image"
        sizes="(max-width: 768px) 95px, (max-width: 1200px) 105px, 125px"
        quality={75}
        priority
      />
      <h2
        className="mb-2 text-lg font-semibold [transition:all_0.2s]"
        itemProp="name"
      >
        Rodrigo Castilho
      </h2>
      <p
        className="mb-8 text-sm font-normal [transition:all_0.2s]"
        itemProp="description"
      >
        Staff Frontend Engineer and ex-@Yahoo in a serious relationship with
        programming languages and the gym.
      </p>
      <SocialLinks />
    </aside>
  );
}
