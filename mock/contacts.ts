export type Contact = {
  id: string
  name: string
  handle: string
  phone?: string
  avatar: string
  recent: boolean
  bantupay: boolean
  address: string
}

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Chidi Okonkwo',  handle: '@chidi',  phone: '+2348034567890', avatar: 'CO', recent: true,  bantupay: true,  address: 'GBCHIDI7F3A9D2E' },
  { id: 'c2', name: 'Ngozi Obi',       handle: '@ngozi',  phone: '+2348056789012', avatar: 'NO', recent: true,  bantupay: true,  address: 'GBNGOZI8E2BA04F' },
  { id: 'c3', name: 'Mama',            handle: '+2348012345678', avatar: 'MA', recent: true,  bantupay: true,  address: 'GBMAMA3C6AF12D' },
  { id: 'c4', name: 'Emeka Nwosu',     handle: '@emeka',  phone: '+2348078901234', avatar: 'EN', recent: false, bantupay: true,  address: 'GBEMEKA2A1C88B' },
  { id: 'c5', name: 'Yusuf Abdullahi', handle: '@yusuf',  phone: '+2348090123456', avatar: 'YA', recent: false, bantupay: true,  address: 'GBYUSUF4D2F891' },
  { id: 'c6', name: 'Adaeze Eze',      handle: '@adaeze', phone: '+2348012678901', avatar: 'AE', recent: false, bantupay: true,  address: 'GBADAEZE3BC44D' },
  { id: 'c7', name: 'Tunde Bakare',    handle: '@tunde',  phone: '+2348023456789', avatar: 'TB', recent: false, bantupay: false, address: '' },
  { id: 'c8', name: 'Fatima Musa',     handle: '@fatima', phone: '+2348045678901', avatar: 'FM', recent: false, bantupay: true,  address: 'GBFATIMA9C7D22E' },
]
