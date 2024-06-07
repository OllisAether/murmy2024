export interface Call {
  contactId: string;
  datetime: string;
  type: 'audio' | 'video';
  status: 'answered' | 'missed' | 'rejected' | 'out-answered' | 'out-rejected';
}