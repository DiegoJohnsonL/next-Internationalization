import DictionaryTable from "@/client/components/dictionary-table";
import { getAllTranslations } from "@/server/services/translation.service";
import Image from "next/image";

interface DictionaryItem {
  id: number;
  key: string;
  value: string;
  language: string;
}

interface TableProps {
  data: DictionaryItem[];
}

export default async function Home() {
  const data = [
    { key: 'User1', value: 'Value1', language: 'English' },
    { key: 'User2', value: 'Value2', language: 'English' },
    { key: 'User3', value: 'Value3', language: 'English' },
    { key: 'User4', value: 'Value4', language: 'English' },
    { key: 'User5', value: 'Value5', language: 'English' },
    { key: 'User6', value: 'Value6', language: 'English' },
    { key: 'User7', value: 'Value7', language: 'English' },
    { key: 'User8', value: 'Value8', language: 'English' },
    { key: 'User9', value: 'Value9', language: 'English' },
    { key: 'User10', value: 'Value10', language: 'English' },
    { key: 'User11', value: 'Value11', language: 'English' },
    { key: 'User12', value: 'Value12', language: 'English' },
    { key: 'User13', value: 'Value13', language: 'English' },
    { key: 'User14', value: 'Value14', language: 'English' },
    { key: 'User15', value: 'Value15', language: 'Spanish' },
    { key: 'User16', value: 'Value16', language: 'Spanish' },
    { key: 'User17', value: 'Value17', language: 'Spanish' },
    { key: 'User18', value: 'Value18', language: 'Spanish' },
    { key: 'User19', value: 'Value19', language: 'Spanish' },
    { key: 'User20', value: 'Value20', language: 'Spanish' },
    { key: 'User21', value: 'Value21', language: 'Spanish' },
    { key: 'User22', value: 'Value22', language: 'Spanish' },
    { key: 'User23', value: 'Value23', language: 'Spanish' },
    { key: 'User24', value: 'Value24', language: 'Spanish' },
    { key: 'User25', value: 'Value25', language: 'Spanish' },
    { key: 'User26', value: 'Value26', language: 'Spanish' },
    { key: 'User27', value: 'Value27', language: 'Spanish' },
    { key: 'User28', value: 'Value28', language: 'Spanish' },
    { key: 'User29', value: 'Value29', language: 'Spanish' },
    { key: 'User30', value: 'Value30', language: 'Spanish'},
    
  ];

  const dictionary = await getAllTranslations();
  console.log(dictionary);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-2 md:px-20 py-20">
       <DictionaryTable data={dictionary} />
    </main>
  );
}
