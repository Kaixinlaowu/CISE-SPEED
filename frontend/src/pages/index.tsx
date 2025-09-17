// pages/index.js - 主页面
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useApi } from './api/useApi';
import { AnalysisData, Article, ExtractionResult, User } from '@/types/api';
import { apiClient } from '@/lib/api-client';
import router from 'next/router';

export default function Home() {
  const [activeTab, setActiveTab] = useState('search');
  const [userRole] = useState('user'); // 默认用户角色

  return (
    <div className={styles.container}>
      <Head>
        <title>学术信息提取与分析平台</title>
        <meta name="description" content="从文章中提取信息并分析" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>学术信息提取与分析平台</h1>
        <nav className={styles.nav}>
          <button 
            className={activeTab === 'search' ? styles.active : ''}
            onClick={() => setActiveTab('search')}
          >
            文章搜索
          </button>
          <button 
            className={activeTab === 'extract' ? styles.active : ''}
            onClick={() => setActiveTab('extract')}
          >
            信息提取
          </button>
          <button 
            className={activeTab === 'analyze' ? styles.active : ''}
            onClick={() => setActiveTab('analyze')}
          >
            数据分析
          </button>
          {userRole === 'admin' && (
            <button 
              className={activeTab === 'admin' ? styles.active : ''}
              onClick={() => setActiveTab('admin')}
            >
              管理配置
            </button>
          )}
        </nav>
        <div className={styles.userPanel}>
          {userRole ? (
            <>
              <button 
                className={styles.userButton}
                onClick={() => router.push('/login')}
              >
                欢迎用户 ({userRole})
              </button>
              <button 
                className={styles.logoutButton}
                onClick={() => {
                  localStorage.clear();
                  router.push('/login');
                }}
              >
                退出
              </button>
            </>
          ) : (
            <button 
              className={styles.loginButton}
              onClick={() => router.push('/login')}
            >
              登录
            </button>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {activeTab === 'search' && <ArticleSearch />}
        {activeTab === 'extract' && <InformationExtraction />}
        {activeTab === 'analyze' && <DataAnalysis />}
        {activeTab === 'admin' && userRole === 'admin' && <AdminPanel />}
      </main>

      <footer className={styles.footer}>
        <p>© 2025 学术信息提取与分析平台</p>
      </footer>
    </div>
  );
}

// 文章搜索组件
function ArticleSearch() {
  const [query, setQuery] = useState('');
  const searchApi = useApi<{ articles: Article[]; totalCount: number }>();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchApi.execute(() => 
      apiClient.searchArticles({ 
        query, 
        limit: 10,
        offset: 0 
      })
    );
  };

  return (
    <div className={styles.tabContent}>
      <h2>寻找合适的文章</h2>
      
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入关键词、DOI或文章标题..."
          required
        />
        <button type="submit" disabled={searchApi.loading}>
          {searchApi.loading ? '搜索中...' : '搜索'}
        </button>
      </form>

      {searchApi.error && (
        <div className={styles.error}>错误: {searchApi.error}</div>
      )}

      {searchApi.data && (
        <div className={styles.results}>
          <h3>搜索结果 ({searchApi.data.totalCount} 条结果)</h3>
          <ul>
            {searchApi.data.articles.map((article) => (
              <li key={article.id} className={styles.articleItem}>
                <h4>{article.title}</h4>
                <p>{article.authors.join(', ')}</p>
                <p>{article.journal} - {article.year}</p>
                {article.doi && <p>DOI: {article.doi}</p>}
                <button>提取信息</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// 信息提取组件
function InformationExtraction() {
  const [articleContent, setArticleContent] = useState('');
  const extractionApi = useApi<ExtractionResult>();
  const saveApi = useApi<void>();

  const handleExtract = async () => {
    await extractionApi.execute(() => 
      apiClient.extractInformation(articleContent)
    );
  };

  const handleSave = async () => {
    if (extractionApi.data) {
      await saveApi.execute(() => 
        apiClient.saveToDatabase(extractionApi.data!)
      );
    }
  };

  return (
    <div className={styles.tabContent}>
      <h2>从文章中提取信息</h2>
      
      <div className={styles.extractionPanel}>
        <div className={styles.inputSection}>
          <h3>输入文章内容</h3>
          <textarea
            value={articleContent}
            onChange={(e) => setArticleContent(e.target.value)}
            placeholder="粘贴文章全文或相关段落..."
            rows={10}
          />
          <button 
            onClick={handleExtract} 
            disabled={extractionApi.loading || !articleContent.trim()}
          >
            {extractionApi.loading ? '提取中...' : '提取信息'}
          </button>
        </div>
        
        <div className={styles.outputSection}>
          <h3>提取的信息</h3>
          {extractionApi.error && (
            <div className={styles.error}>错误: {extractionApi.error}</div>
          )}
          
          {extractionApi.data && (
            <div>
              <div className={styles.extractedData}>
                <h4>关键数据</h4>
                {extractionApi.data.extractedData.keyFigures?.map((figure, index) => (
                  <div key={index} className={styles.keyFigure}>
                    <strong>{figure.label}:</strong> {figure.value} 
                    {figure.type === 'percentage' && '%'}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleSave} 
                disabled={saveApi.loading}
              >
                {saveApi.loading ? '保存中...' : '保存到SPEED数据库'}
              </button>
              
              {saveApi.error && (
                <div className={styles.error}>保存错误: {saveApi.error}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 数据分析组件
function DataAnalysis() {
  const [data, setData] = useState([]);
  const [visualizationType, setVisualizationType] = useState('chart');

  useEffect(() => {
    // 获取分析数据
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analysis/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className={styles.tabContent}>
      <h2>数据分析与可视化</h2>
      <div className={styles.analysisControls}>
        <select 
          value={visualizationType} 
          onChange={(e) => setVisualizationType(e.target.value)}
        >
          <option value="chart">图表视图</option>
          <option value="table">表格视图</option>
          <option value="stats">统计摘要</option>
        </select>
      </div>
      
      <div className={styles.visualization}>
        {visualizationType === 'chart' && <ChartVisualization data={data} />}
        {visualizationType === 'table' && <TableView data={data} />}
        {visualizationType === 'stats' && <StatisticalView data={data} />}
      </div>
    </div>
  );
}

// 管理员面板组件
function AdminPanel() {
  const [config, setConfig] = useState({});
  const [users, setUsers] = useState([] as User[]);

  useEffect(() => {
    // 获取配置和用户数据
    const fetchAdminData = async () => {
      try {
        const [configRes, usersRes] = await Promise.all([
          fetch('/api/admin/config'),
          fetch('/api/admin/users')
        ]);
        
        const configData = await configRes.json();
        const usersData = await usersRes.json();
        
        setConfig(configData);
        setUsers(usersData);
      } catch (error) {
        console.error('获取管理数据失败:', error);
      }
    };
    
    fetchAdminData();
  }, []);

  const updateConfig = async (updatedConfig: unknown) => {
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      });
      
      if (response.ok) {
        alert('配置已更新！');
      }
    } catch (error) {
      console.error('更新配置失败:', error);
    }
  };

  return (
    <div className={styles.tabContent}>
      <h2>管理员控制面板</h2>
      
      <div className={styles.adminSections}>
        <div className={styles.adminSection}>
          <h3>系统配置</h3>
          {/* 配置表单将在这里实现 */}
          <button onClick={() => updateConfig(config)}>保存配置</button>
        </div>
        
        <div className={styles.adminSection}>
          <h3>用户管理</h3>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>用户名</th>
                <th>角色</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <button>编辑</button>
                    <button>删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className={styles.adminSection}>
          <h3>数据库管理</h3>
          <button>备份数据库</button>
          <button>优化数据库</button>
          <button>清除缓存</button>
        </div>
      </div>
    </div>
  );
}

// 可视化组件（简化示例）
// 图表可视化组件
function ChartVisualization({ data }: { data: AnalysisData[] }) {
  return (
    <div className={styles.chartContainer}>
      <h4>数据图表可视化</h4>
      <div className={styles.chartPlaceholder}>
        {/* 这里可以集成Chart.js、D3.js或ECharts等图表库 */}
        <p>图表将在这里显示</p>
        <div className={styles.chartStats}>
          <p>数据点数: {data.length}</p>
          <p>指标类型: {new Set(data.map(item => item.metric)).size} 种</p>
        </div>
      </div>
    </div>
  );
}

// 表格视图组件
function TableView({ data }: { data: AnalysisData[] }) {
  if (data.length === 0) {
    return <div className={styles.noData}>暂无数据</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <h4>数据表格视图</h4>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>指标</th>
            <th>值</th>
            <th>单位</th>
            <th>类别</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.metric}</td>
              <td>{typeof item.value === 'number' ? item.value.toFixed(2) : item.value}</td>
              <td>{item.unit || 'N/A'}</td>
              <td>{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 统计摘要组件
function StatisticalView({ data }: { data: AnalysisData[] }) {
  if (data.length === 0) {
    return <div className={styles.noData}>暂无数据</div>;
  }

  // 计算数值型数据的统计信息
  const numericData = data.filter(item => typeof item.value === 'number');
  const numericValues = numericData.map(item => item.value as number);

  const stats = {
    count: data.length,
    numericCount: numericValues.length,
    min: numericValues.length > 0 ? Math.min(...numericValues) : null,
    max: numericValues.length > 0 ? Math.max(...numericValues) : null,
    average: numericValues.length > 0 
      ? numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length 
      : null,
    categories: new Set(data.map(item => item.category)).size,
    metrics: new Set(data.map(item => item.metric)).size
  };

  return (
    <div className={styles.statsContainer}>
      <h4>数据统计摘要</h4>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h5>总体统计</h5>
          <p>总数据点: <strong>{stats.count}</strong></p>
          <p>数值数据点: <strong>{stats.numericCount}</strong></p>
          <p>指标类型: <strong>{stats.metrics}</strong></p>
          <p>数据类别: <strong>{stats.categories}</strong></p>
        </div>

        {stats.numericCount > 0 && (
          <>
            <div className={styles.statCard}>
              <h5>数值范围</h5>
              <p>最小值: <strong>{stats.min?.toFixed(2)}</strong></p>
              <p>最大值: <strong>{stats.max?.toFixed(2)}</strong></p>
              <p>平均值: <strong>{stats.average?.toFixed(2)}</strong></p>
            </div>

            <div className={styles.statCard}>
              <h5>数据分布</h5>
              <p>数值范围: <strong>{stats.min?.toFixed(2)} - {stats.max?.toFixed(2)}</strong></p>
              <p>数据跨度: <strong>{(stats.max && stats.min) ? (stats.max - stats.min).toFixed(2) : 'N/A'}</strong></p>
            </div>
          </>
        )}
      </div>

      {/* 分类统计 */}
      <div className={styles.categoryStats}>
        <h5>按类别统计</h5>
        {Array.from(new Set(data.map(item => item.category))).map(category => {
          const categoryData = data.filter(item => item.category === category);
          const numericCategoryData = categoryData.filter(item => typeof item.value === 'number');
          const numericValues = numericCategoryData.map(item => item.value as number);
          
          return (
            <div key={category} className={styles.categoryItem}>
              <h6>{category}</h6>
              <p>数据点: {categoryData.length}</p>
              {numericValues.length > 0 && (
                <p>平均值: {(numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length).toFixed(2)}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}