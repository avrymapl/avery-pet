'use client';

import Image from 'next/image';

export default function SidebarContent() {
  return (
    <>
      <div className="row" style={{ alignItems: 'center' }}>
        <Image
          src="/images/pfp.png"
          alt="my pfp"
          width={84}
          height={84}
          style={{
            borderRadius: '50%',
            border: '6px solid #ede7e1',
          }}
        />
        <div className="column" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 style={{ textAlign: 'center' }}>hi, i&apos;m avery!</h2>
          <i style={{ textAlign: 'center' }}>(she/they)</i>
        </div>
      </div>

      <p>
        welcome to my little corner of the internet where i share my projects, thoughts, and things
        i find interesting! i mainly focus on science, linguistics, and conlangs, but also just post
        about my life in general. i don&apos;t expect many visitors, but at least it&apos;s proof
        that i exist — thanks for stopping by! :3
      </p>
    </>
  );
}
