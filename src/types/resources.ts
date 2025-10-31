export interface Resource {
  _id?: string;
  title: string;
  url: string;
  category: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResourceRequest {
  title: string;
  url: string;
  category: string;
  description: string;
}

export interface UpdateResourceRequest extends CreateResourceRequest {
  _id: string;
}