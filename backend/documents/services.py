import boto3
from django.conf import settings
from botocore.exceptions import ClientError

def generate_presigned_url(s3_client, bucket_name, object_name, expiration=3600):
    try:
        response = s3_client.generate_presigned_url('put_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        print(e)
        return None
    return response

class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=getattr(settings, 'AWS_ACCESS_KEY_ID', None),
            aws_secret_access_key=getattr(settings, 'AWS_SECRET_ACCESS_KEY', None),
            region_name=getattr(settings, 'AWS_S3_REGION_NAME', 'us-east-1')
        )
        self.bucket_name = getattr(settings, 'AWS_STORAGE_BUCKET_NAME', 'timetable-input-bucket')

    def get_presigned_upload_url(self, object_name):
        return generate_presigned_url(self.s3_client, self.bucket_name, object_name)
