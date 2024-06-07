import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  const { name, imageUrl } = await req.json();
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID_PATCH', error);
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  const profile = await currentProfile();

  if (!profile) return new NextResponse('Unauthorized', { status: 401 });

  if (!params.serverId)
    return new NextResponse('Server ID is missing', { status: 400 });

  try {
    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log(['SERVER_ID_DELETE'], error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
