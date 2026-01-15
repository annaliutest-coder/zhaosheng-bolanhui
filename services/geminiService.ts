
/**
 * 注意：為了安全起見與資料庫整合，AI 生成信件的邏輯已移至 FastAPI 後端 (main.py)。
 * 此檔案目前僅供參考或作為後備方案。
 */
export async function generateWelcomeLetter(studentName: string): Promise<string> {
  return `親愛的 ${studentName}，歡迎來到 ABC 系！我們已將您的資料存入資料庫，並將透過 Email 送上專屬介紹。`;
}
