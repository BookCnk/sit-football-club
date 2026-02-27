import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const MAX_SLIP_SIZE_BYTES = 5 * 1024 * 1024;

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getServiceRoleKey() {
  const value = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY').trim();
  const looksLikeJwt = value.split('.').length === 3 && value.startsWith('eyJ');

  if (!looksLikeJwt) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is invalid. Copy the service_role key from Supabase Project Settings > API.',
    );
  }

  return value;
}

export function createAdminClient() {
  return createClient(
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getServiceRoleKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export async function ensurePublicBucket(
  supabase: SupabaseClient,
  bucketName: string,
) {
  const { data: buckets, error: listBucketsError } = await supabase.storage.listBuckets();

  if (listBucketsError) {
    throw new Error(`Unable to read Supabase buckets: ${listBucketsError.message}`);
  }

  const bucket = buckets.find(
    (entry) => entry.id === bucketName || entry.name === bucketName,
  );

  if (!bucket) {
    const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: MAX_SLIP_SIZE_BYTES,
    });

    if (createBucketError) {
      throw new Error(`Unable to create Supabase bucket "${bucketName}": ${createBucketError.message}`);
    }

    return;
  }

  if (!bucket.public) {
    const { error: updateBucketError } = await supabase.storage.updateBucket(bucketName, {
      public: true,
      fileSizeLimit: MAX_SLIP_SIZE_BYTES,
    });

    if (updateBucketError) {
      throw new Error(`Unable to update Supabase bucket "${bucketName}": ${updateBucketError.message}`);
    }
  }
}
